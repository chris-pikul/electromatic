/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Application wide state management
 */
import type { AppState } from './state';
import type { AppStateAction } from './actions';

export function appStateReducer(state:AppState, action:AppStateAction):AppState {
    const next = { ...state };
    return next;
}
export default appStateReducer;
