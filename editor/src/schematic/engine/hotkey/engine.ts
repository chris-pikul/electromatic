/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Provides contexts and a singleton engine for mapping hotkey combinations with
 * event listeners.
 */
import {
    comboStringToKeys,
    findKeysInEvent,
    KeyCombo,
    keyComboToKeys,
    keysComboToString,
    keysToKeyCombo,
} from './keys';

import type { EAnyKey } from './keys';

export class HotkeyEngine {
    #listeningKeys = new Set<EAnyKey>();
    #listeningCombos = new Map<string, Function[]>();

    #watching = new Set<EAnyKey>();

    constructor() {
        this.addShortcut = this.addShortcut.bind(this);
        this.removeShortcut = this.removeShortcut.bind(this);

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleKeyCombo = this.handleKeyCombo.bind(this);

        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    public addShortcut(combo:string, cb:Function):void {
        const keyCombo = comboStringToKeys(combo);
        const keys = keyComboToKeys(keyCombo);
        const keyComboStr = keysComboToString(keyCombo);

        // Add all different keys to listener
        keys.forEach(key => this.#listeningKeys.add(key));

        // Add total combo to it's own listener
        if(this.#listeningCombos.has(keyComboStr)) {
            // Duplicate, add to list
            this.#listeningCombos.get(keyComboStr)?.push(cb);
        } else {
            this.#listeningCombos.set(keyComboStr, [ cb ]);
        }
    }

    public removeShortcut(combo:string, cb:Function):void {

    }

    private handleKeyDown(evt:KeyboardEvent) {
        if(evt.target === document.body || evt.target === document.documentElement) {
            const [ modifier, key ] = findKeysInEvent(evt);
            if(modifier || key) {
                if(this.#listeningKeys.has((modifier ?? key) as EAnyKey))
                    evt.preventDefault();

                this.#watching.add((modifier ?? key) as EAnyKey);
            }
        }
    }

    private handleKeyUp(evt:KeyboardEvent) {
        if(evt.target === document.body || evt.target === document.documentElement) {
            const [ modifier, key ] = findKeysInEvent(evt);
            if(modifier || key) {
                if(this.handleKeyCombo([ ...this.#watching ]))
                    evt.preventDefault();
                
                this.#watching.delete((modifier ?? key) as EAnyKey);
            }
        }
    }

    private handleKeyCombo(keys:EAnyKey[]):boolean {
        let keyCombo:KeyCombo;
        try {
            keyCombo = keysToKeyCombo(keys);
        } catch(err) {
            return false;
        }
        const keyComboStr = keysComboToString(keyCombo);

        if(this.#listeningCombos.has(keyComboStr)) {
            console.log(`Firing callbacks for combo ${keyComboStr}`);
            this.#listeningCombos.get(keyComboStr)?.forEach(cb => cb());
        }

        return false;
    }
};
export default HotkeyEngine;
