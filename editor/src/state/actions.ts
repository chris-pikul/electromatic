/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Application wide state management
 */

export const AppStateActionTypes = {

} as const;

export type EAppStateActionType = typeof AppStateActionTypes[keyof typeof AppStateActionTypes];
