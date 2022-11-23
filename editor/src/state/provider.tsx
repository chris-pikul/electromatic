/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Application wide state management
 */
import { useEffect, useReducer } from 'react';
import type { FC, ReactNode } from 'react';

import DefaultAppState from './state';
import appStateReducer from './reducer';
import { AppContext, AppDispatchContext, setRawAppStateDispatcher } from './context';

import type { AppState } from './state';
import type { AppStateDispatcher } from './actions';
import { initializeAppStatePersist } from './persistance';

export const AppStateProvider:FC<{ children?:ReactNode }> = ({ children }) => {
    const [ state, dispatch ] = useReducer(appStateReducer, DefaultAppState);

    setRawAppStateDispatcher(dispatch);

    useEffect(() => {
        initializeAppStatePersist();
    }, []);

    return (
        <AppContext.Provider value={state as AppState}>
            <AppDispatchContext.Provider value={dispatch as AppStateDispatcher}>
                { children }
            </AppDispatchContext.Provider>
        </AppContext.Provider>
    );
};
export default AppStateProvider;
