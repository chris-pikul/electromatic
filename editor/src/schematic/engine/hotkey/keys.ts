/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Provides contexts and a singleton engine for mapping hotkey combinations with
 * event listeners.
 */
export const AlphaNumericKeys = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z',
] as const;;
export type EAlphaNumericKey = typeof AlphaNumericKeys[number];

export const SymbolKeys = [
    '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
    '-', '_', '=', '+', '[', '{', ']', '}', '\\', '|',
    ';', ':', '\'', '\"', ',', '<', '.', '>', '/', '?',
    '`', '~',
] as const;;
export type ESymbolKey = typeof SymbolKeys[number];

export const FunctionKeys = [
    'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9',
    'F10', 'F11', 'F12', 'ScrollLock', 'Pause', 'Insert', 'Delete',
    'PageUp', 'PageDown', 'Home', 'End', 'Enter', 'NumpadEnter',
    'Escape', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft',
    'ArrowRight', 'Tab', 'CapsLock', 'Backspace'
] as const;;
export type EFunctionKey = typeof FunctionKeys[number];

export const Keys = [
    ...AlphaNumericKeys,
    ...SymbolKeys,
    ...FunctionKeys,
] as const;
export type EKey = typeof Keys[number];
export type EOptionalKey = EKey | null;

export function findKeyInEvent(evt:KeyboardEvent):EOptionalKey {
    // Check modifiers, they are a shorter list
    let dummyTest:string;
    if(evt.key) {
        dummyTest = evt.key.toUpperCase();
    } else if(evt.code) {
        dummyTest = evt.code;
        if(dummyTest.startsWith('Key'))
            dummyTest.substring(3);
    } else {
        return null;
    }

    if(Keys.includes(dummyTest as EKey))
        return dummyTest as EKey;
    return null;
}

export const ModifierKeys = [
    'Control', 'Alt', 'Shift', 'Meta',
] as const;;
export type EModifierKey = typeof ModifierKeys[number];
export type EOptionalModifierKey = EModifierKey | null;

export function findModifierInEvent(evt:KeyboardEvent):EOptionalModifierKey {
    // Check modifiers, they are a shorter list
    let dummyTest:string;
    if(evt.key) {
        dummyTest = evt.key;
    } else if(evt.code) {
        dummyTest = evt.code;
        if(dummyTest.startsWith('Key'))
            dummyTest.substring(3);
    } else {
        return null;
    }

    if(ModifierKeys.includes(dummyTest as EModifierKey))
        return dummyTest as EModifierKey;
    return null;
}

export const AllKeys = [
    ...Keys,
    ...ModifierKeys,
] as const;
export type EAnyKey = typeof AllKeys[number];
export type EOptionalAnyKey = EAnyKey | null;

export function findKeysInEvent(evt:KeyboardEvent):[EOptionalModifierKey, EOptionalKey] {
    return [
        findModifierInEvent(evt),
        findKeyInEvent(evt),
    ];
}

export type KeyCombo = {
    key?:EKey;
    shift?:boolean;
    control?:boolean;
    alt?:boolean;
    meta?:boolean;
};

export function keyComboToKeys(combo:KeyCombo):EAnyKey[] {
    const result:EAnyKey[] = [];

    if(combo.meta)
        result.push('Meta');

    if(combo.control)
        result.push('Control');
    
    if(combo.alt)
        result.push('Alt');

    if(combo.shift)
        result.push('Shift');

    if(combo.key)
        result.push(combo.key);

    return result;
}

export function keysComboToString(keys:KeyCombo):string {
    let comboArr:EAnyKey[] = keyComboToKeys(keys);

    return comboArr.join('+');
}

export function keysToKeyCombo(keys:EAnyKey[]):KeyCombo {
    const result:KeyCombo = {};
    for(const key of keys) {
        switch(key) {
            case 'Shift':
                result.shift = true;
                break;
            case 'Control':
                result.control = true;
                break;
            case 'Alt':
                result.alt = true;
                break;
            case 'Meta':
                result.meta = true;
                break;
            default:
                if(Keys.includes(key as EKey)) {
                    if(result.key)
                        throw new Error(`Hotkey combo "${keys.join('+')}" already contains a key "${key}"`);
                    else
                        result.key = key as EKey;
                } else {
                    throw new Error(`Hotkey combo "${keys.join('+')}" contains an invalid keyname "${key}"`);
                }
        }
    }

    return result;
}

export function comboStringToKeys(combo:string):KeyCombo {
    const dirtyKeys:string[] = combo.split('+')
        .map(str => str.trim());
    
    dirtyKeys.forEach(key => {
        // Assert is valid key
        if(!AllKeys.includes(key as EAnyKey))
            throw new Error(`Key "${key}" is not a valid key`);
    });

    return keysToKeyCombo(dirtyKeys as unknown as EAnyKey[]);
}
