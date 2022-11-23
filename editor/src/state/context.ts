/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Application wide state management
 */
import { createContext, useContext } from 'react';

import DefaultAppState from './state';
import type { AppStateAction, AppStateDispatcher, EAppStateActionType } from './actions';
import type { AppState } from './state';

export const AppContext = createContext<AppState|null>(null);
export function useAppState():AppState {
    return useContext(AppContext) ?? DefaultAppState;
}

export const AppDispatchContext = createContext<AppStateDispatcher|null>(null);
const deadDispatcher:AppStateDispatcher = (action:AppStateAction) => console.error(`Application state dispatcher was not ready for action`, action);
export function useAppStateDispatch():AppStateDispatcher {
    return useContext(AppDispatchContext) ?? deadDispatcher;
}

export function useApplicationState():[AppState, AppStateDispatcher] {
    const state = useAppState();
    const dispatch = useAppStateDispatch();

    return [ state, dispatch ];
}
export default useApplicationState;


let appDispatcher:(AppStateDispatcher|undefined);
export function getRawAppStateDispatcher():AppStateDispatcher|undefined {
    return appDispatcher;
}
export function setRawAppStateDispatcher(dispatcher:(AppStateDispatcher|undefined)):void {
    if(typeof dispatcher === 'function' && pendingActions.length > 0) {
        pendingActions.forEach(action => dispatcher(action));
        pendingActions = [];
    }
    appDispatcher = dispatcher;
}

let pendingActions:Array<AppStateAction> = [];
export function dispatchRaw(action:AppStateAction):void {
    if(typeof appDispatcher === 'function') {
        appDispatcher(action);
    } else {
        pendingActions.push(action);
        console.log(`No dispatcher available, pushing action into pending queue`, action);
    }
}


export function wrapPromiseResults(prom:Promise<any>, resolveType:EAppStateActionType, rejectType?:EAppStateActionType):void {
    prom.then(function() {
        const dispatch = getRawAppStateDispatcher();
        if(typeof dispatch === 'function') {
            dispatch({
                type: resolveType,
                resolution: [ ...arguments ],
            });
        } else console.error(`Unable to call dispatch on wrapped promise, it is not a valid function`, AppDispatchContext);
    })
    .catch(function() {
        const dispatch = getRawAppStateDispatcher();
        if(typeof dispatch === 'function') {
            dispatch({
                type: rejectType ?? resolveType,
                rejection: [ ...arguments ],
            });
        } else console.error(`Unable to call dispatch on wrapped promise, it is not a valid function`, AppDispatchContext);
    });
}
