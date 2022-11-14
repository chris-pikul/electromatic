/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * WebGL based oscilloscope for displaying probed voltage over time.
 */
import { useRef, useEffect } from 'react';
import type { FC } from 'react';

function getTimestampFunc():(() => number) {
    if(window.performance.now)
        return () => window.performance.now();
    else if((window.performance as any).webkitNow)
        return () => (window.performance as any).webkitNow();
    return () => (new Date()).getTime();
}



interface OscilloscopeProps {

};

import './Oscilloscope.scss';
export const Oscilloscope:FC<OscilloscopeProps> = () => {
    const parentRef = useRef(null);
    const canvasRef = useRef(null);

    const timeNow = getTimestampFunc();

    const draw = (ctx:CanvasRenderingContext2D, delta:number, rect:DOMRect) => {
        const { width, height } = rect;

        ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'hsl(162deg, 60%, 60%)';
        
        ctx.beginPath();
        ctx.moveTo(0, height/2);
        ctx.lineTo(width, height/2);
        ctx.stroke();
    };

    useEffect(() => {
        // Ensure parent div is ok
        if(!parentRef.current)
            throw new Error(`Expected a parent element during useEffect, but none found in ref`);

        // Grab the canvas element
        if(!canvasRef.current)
            throw new Error(`Expected a canvas element during useEffect, but none found in ref`);
        const canvas = canvasRef.current as HTMLCanvasElement;
        
        // Grab the context
        const ctx = canvas.getContext('2d');
        if(!ctx)
            throw new Error(`Unable to get rendering context from canvas`);

        // Hold the canvas size here
        let rect:DOMRect = canvas.getBoundingClientRect();
        const resizeObserver = new ResizeObserver(entries => {
            const [ entry ] = entries;
            if(entry && entry.contentRect) {
                rect = entry.contentRect;
            }
        });
        resizeObserver.observe(parentRef.current);

        let lastFrameTime:number = timeNow();
        let frameTime:number = 0;
        let deltaTime:number = 0;
        let animHandle:number;

        const render = () => {
            frameTime = timeNow();
            deltaTime = frameTime - lastFrameTime;
            lastFrameTime = frameTime;

            draw(ctx, deltaTime, rect);

            animHandle = window.requestAnimationFrame(render);
        };
        render();

        // Cleanup after component leaves
        return () => {
            resizeObserver.disconnect();
            window.cancelAnimationFrame(animHandle);
        };
    }, [ draw ]);

    return <div ref={parentRef} className='oscilloscope'>
        <canvas ref={canvasRef} width='512' height='910'>
            No canvas support, cannot draw oscilloscope!
        </canvas>
    </div>
}
export default Oscilloscope;