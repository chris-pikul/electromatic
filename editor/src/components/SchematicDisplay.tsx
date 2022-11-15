/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Provides the canvas rendering for the main schematic display.
 * 
 * This is the React component that uses the display class.
 */
import { useRef, useEffect, memo } from 'react';
import type { FC } from 'react';

import Display from '@/display';

export interface SchematicDisplayProps {

};

const Component:FC<SchematicDisplayProps> = () => {
    const containerRef = useRef(null);
    const displayRef = useRef<Display|null>(null);

    useEffect(() => {
        if(containerRef.current === null)
            return;

        if(displayRef.current === null)
            displayRef.current = new Display(containerRef.current);
    });

    return <div ref={containerRef} className='schematic-display' />
};
export const SchematicDisplay = memo(Component);
export default SchematicDisplay;
