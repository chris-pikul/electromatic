/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Utilities for dealing with menu hotkeys
 */
import type { FC } from 'react';

export type HotKeyModifier = 'ctrl' | 'alt' | 'shift';
export type HotKeyCharacter = `${string}`;
export type HotKey = HotKeyCharacter | Array<HotKeyModifier | HotKeyCharacter>;

export const HotKeyLabel:FC<{ label:string; hotkey?: HotKey; }> = ({ label, hotkey }) => {

    const defaultLabel = () => <span className='menu-hotkey-label'>{ label }</span>;

    const keyLabel = (char:string) => {
        const keyIndex = label.toLowerCase().indexOf(char);
        if(keyIndex === -1)
            return defaultLabel(); // Doesn't even contain the letter
        
        return <span className='menu-hotkey-label'>{[
            label.substring(0, keyIndex),
            <u key='hotkey-under'>{ label.substring(keyIndex, keyIndex+1) }</u>,
            label.substring(keyIndex+1),
        ]}</span>;
    };

    if(hotkey !== undefined) {
        if(Array.isArray(hotkey)) {
            // Array with modifiers
            const singles = hotkey.filter(entry => entry.length === 1);
            if(singles.length === 1) {
                // We can only hotkey label stuff with one character
                return keyLabel(singles[0][0].toLowerCase());
            }

            // Not available for hot-key labelling
            return defaultLabel();
        }

        // Single character
        return keyLabel(hotkey[0].toLowerCase());
    }

    // No hotkey
    return defaultLabel();
};

export const HotKeyList:FC<{ hotkey?:HotKey }> = ({ hotkey }) => {
    if(hotkey) {
        if(Array.isArray(hotkey)) {
            return <span className='menu-hotkey'>
                { 
                    hotkey.map((ent, ind) => [<kbd key={ind}>{ ent }</kbd>, '+' ]) 
                        .flat(2)
                        .filter(ent => !!ent)
                        .slice(0, (hotkey.length * 2) - 1)
                }
            </span>
        }

        return <span className='menu-hotkey'><kbd>{ hotkey }</kbd></span>
    }

    return null;
};
