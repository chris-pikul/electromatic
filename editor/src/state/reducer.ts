/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Application wide state management
 */
import { AppStateActionTypes } from './actions';

import type { AppState } from './state';
import type { AppStateAction } from './actions';

export function appStateReducer(state:AppState, action:AppStateAction):AppState {
    const next = { ...state };
    switch(action.type) {
        case AppStateActionTypes.SET_APP_THEME:
            next.appTheme = action.theme;
            break;
        case AppStateActionTypes.FULLSCREEN_CHANGE:
            next.isFullscreen = !!action.fullscreen;
            break;
        default:
            console.warn(`Unknown action in application state reducer`, action);
    }
    return next;
}
export default appStateReducer;
