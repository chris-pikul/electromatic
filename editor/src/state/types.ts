/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Application wide state management
 */

export interface AppState {

};

export interface AppStateActionObject {

};
export type AppStateAction = string | AppStateActionObject;

export type AppStateDispatcher = (action:AppStateAction) => void;