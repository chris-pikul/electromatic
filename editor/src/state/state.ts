/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Application wide state management
 */
export interface AppState {
    appTheme: string;
    isFullscreen: boolean;
};

export const DefaultAppState:AppState = {
    appTheme: 'auto',
    isFullscreen: false,
};
export default DefaultAppState;
