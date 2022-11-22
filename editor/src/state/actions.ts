/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Application wide state management
 */

export const AppStateActionTypes = {
    SET_APP_THEME: 'set-app-theme',
} as const;

export type EAppStateActionType = typeof AppStateActionTypes[keyof typeof AppStateActionTypes];

export interface AppStateActionObject {
    type: EAppStateActionType;

    [key:string]: any;
};
export type AppStateAction = EAppStateActionType | AppStateActionObject;

export type AppStateDispatcher = (action:AppStateAction) => void;
