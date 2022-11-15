/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Utilities for schematic display
 */

export interface Point {
    x:number;
    y:number;
}

export interface Size {
    width:number;
    height:number;
}

export interface View extends Point, Size {
    zoom:number;
}
export type ViewProp = keyof View;

export function random(_arg0?:number, _arg1?:number):number {
    if(_arg0) {
        if(_arg1)
            return (Math.random() * (_arg1 - _arg0)) + _arg0;
        return (Math.random() * _arg0);
    }

    return Math.random();
}

export function randomInt(_arg0?:number, _arg1?:number):number {
    return Math.trunc(random(_arg0, _arg1));
}

export function clamp(val:number, _arg0?:number, _arg1?:number):number {
    let min = 0;
    let max = 1;

    if(_arg0) {
        if(_arg1) {
            min = _arg0;
            max = _arg1;
        } else {
            max = _arg0;
        }
    }

    return Math.max(min, Math.min(val, max));
}

export function debounce(fn:Function, delayMS = 250):Function {
    let timeout:ReturnType<typeof setTimeout>;

    return function(this:any, ...args:unknown[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delayMS);
    }
}

export function throttle(fn:Function, delayMS = 250):Function {
    let throttling = false;
    let timeout:ReturnType<typeof setTimeout>;
    let lastTime = 0;

    return function(this:any) {
        const context = this;
        const args = arguments;

        if(!throttling) {
            fn.apply(context, args);
            lastTime = Date.now();
            throttling = true;
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if(Date.now() - lastTime >= delayMS) {
                    fn.apply(context, args);
                    lastTime = Date.now();
                }
            }, Math.max(delayMS - (Date.now() - lastTime), 0));
        }
    }
}
