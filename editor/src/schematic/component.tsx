/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Schematic display system, for displaying and interacting with the actual
 * schematic editor.
 * 
 * This provides the React component for displaying and initializing the display
 * canvas.
 */
import { useRef, useEffect } from 'react';
import type { FC } from 'react'

import { useSchematicContext, getSchematicRef, _setSchematicRef } from './context';

import Display from './engine';

export const SchematicDisplay:FC<{ }> = ({ }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if(containerRef.current === null)
            return;

        if(!getSchematicRef())
            _setSchematicRef( new Display(containerRef.current) );
    }, [ containerRef ]);

    return <div ref={containerRef} className='schematic-display' />
};
export default SchematicDisplay;
