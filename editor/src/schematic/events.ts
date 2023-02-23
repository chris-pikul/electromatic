/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Provides an event system for cross-communication with the Electromatic
 * instance.
 */
import { getSchematicRef } from './context';

export const SchematicEventTypes = {
    TOGGLE_GRID: 'toggle-grid',
} as const;
export type ESchematicEventType = typeof SchematicEventTypes[keyof typeof SchematicEventTypes];

export function postSchematicEvent(type:ESchematicEventType, data?:any):void {
    const ref = getSchematicRef();
    if(ref)
        ref.postEvent(type, data);
    console.log('Posted event to display engine', type, data);
}

export function receiveSchematicEvent(type:ESchematicEventType, data?:any):void {
    console.log('Received event from display engine', type, data);
}
