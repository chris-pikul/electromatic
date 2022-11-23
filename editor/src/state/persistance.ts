/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Application wide state management
 */
import { dispatchRaw } from './context';
import type { AppState } from './state';

const STORE_KEY:string = 'electromatic';
const STORAGE_TEST:string= '__storage_test__';

const APP_VERSION:string = import.meta.env.VITE_APP_VERSION;

let storeNonce:number = 0;
let storeInit:boolean = false;

interface AppStateStore {
    nonce:number;
    version:string;
    state:AppState 
}

function isStorageAvailable():boolean {
    let storage;
    try {
        storage = window['localStorage'];
        storage.setItem(STORAGE_TEST, STORAGE_TEST);
        storage.removeItem(STORAGE_TEST);
        return true;
    } catch(err) {
        return false;
    }
}

function getStore():(AppStateStore|null) {
    try {
        const str = localStorage.getItem(STORE_KEY);
        if(str) {
            const obj = JSON.parse(str);
            if(typeof obj === 'object' || typeof obj.nonce === 'number')
                return obj as AppStateStore;

            console.warn('invalid persistance store', obj);
        }
    } catch(err) {
        console.warn('unable to retrieve persistance store');
    }

    return null;
}

function handleStorageChange() {
    // Storage was changed by some other window
    const store = getStore();
    if(store && store.version === APP_VERSION)
        hydrateState(store);
    console.info(`Picked up change in persisted store`, store);
}

export function initializeAppStatePersist():void {
    if(storeInit)
        return console.info('Persistance already initialized');
    
    if(!isStorageAvailable())
        return console.warn('No storage available, persistance cannot continue');
    
    // Hydrate current version
    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);

    storeInit = true;
}

export function hydrateState(store:AppStateStore):void {
    if(store.nonce === storeNonce)
        return; // Feedback loop?
    
    storeNonce = store.nonce;
    dispatchRaw({
        type: 'persist-hydrate',
        state: store.state,
    });
}

export function persistState(state:AppState):void {
    const perform = () => {
        const store:AppStateStore = {
            nonce: storeNonce++,
            version: APP_VERSION,
            state,
        };
        
        try {
            const json = JSON.stringify(store);
            localStorage.setItem(STORE_KEY, json);
            console.info('Persisted state', store);
        } catch(err) {
            console.error(`failed to update localStorage store`, err);
        }
    };

    // Make it async if we can
    setTimeout(perform, 0);
}