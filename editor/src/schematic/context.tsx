/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Schematic display system, for displaying and interacting with the actual
 * schematic editor.
 * 
 * This provides the context for react to be able to interact with the canvas
 * rendering engine.
 */
import { createContext, createRef, useContext } from 'react';
import type { FC, ReactNode } from 'react';

import type {
    ISchematicDisplay,
    TOptSchematicDisplay,
    TSchematicRef,
    TSchematicContext,
} from './types';

const SchematicRef:TSchematicRef = createRef<TOptSchematicDisplay>();
const SchematicContext:TSchematicContext = createContext<TSchematicRef>(SchematicRef);

export function getSchematicRef():TOptSchematicDisplay {
    return SchematicRef.current;
}

export function _setSchematicRef(disp:ISchematicDisplay):void {
    SchematicRef.current = disp;
}

export function useSchematicContext() {
    return useContext(SchematicContext);
}

export const SchematicContextProvider:FC<{ children?:ReactNode }> = ({ children }) => (
    <SchematicContext.Provider value={SchematicRef}>
        { children }
    </SchematicContext.Provider>
);
