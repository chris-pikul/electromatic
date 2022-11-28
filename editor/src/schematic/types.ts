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

export interface ISchematicDisplay {

};

export type TOptSchematicDisplay = ISchematicDisplay | null;
export type TSchematicRef = MutableRefObject<TOptSchematicDisplay>;
export type TSchematicContext = Context<TSchematicRef>;