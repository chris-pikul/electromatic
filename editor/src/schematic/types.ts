/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Schematic display system, for displaying and interacting with the actual
 * schematic editor.
 */
import type { MutableRefObject, Context } from 'react'
import type { ESchematicEventType } from './events';

export interface ISchematicDisplay {
    postEvent(type:ESchematicEventType, data?:any):void;
};

export type TOptSchematicDisplay = ISchematicDisplay | null;
export type TSchematicRef = MutableRefObject<TOptSchematicDisplay>;
export type TSchematicContext = Context<TSchematicRef>;