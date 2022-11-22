/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Application wide state management
 */
export { useApplicationState, useAppState, useAppStateDispatch } from './context';
export { AppStateActionTypes } from './actions';
export { AppStateProvider } from './provider';

export type { AppState, AppStateDispatcher, AppStateAction, AppStateActionObject } from './types';
