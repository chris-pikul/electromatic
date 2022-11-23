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
    SET_SCHEME_THEME: 'set-scheme-theme',
    SET_SCOPE_THEME: 'set-scope-theme',
} as const;

export type EAppStateActionType = typeof AppStateActionTypes[keyof typeof AppStateActionTypes];

export interface AppStateAction {
    type: EAppStateActionType;

    [key:string]: any;
};

export type AppStateDispatcher = (action:AppStateAction) => void;

export const ActionSetAppTheme = (theme:string):AppStateAction => ({
    type: AppStateActionTypes.SET_APP_THEME,
    theme,
});
