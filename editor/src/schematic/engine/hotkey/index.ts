/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Provides contexts and a singleton engine for mapping hotkey combinations with
 * event listeners.
 */
export { HotkeyEngine } from './engine';

/* Type Declarations */

export type {
    EAlphaNumericKey,
    ESymbolKey,
    EFunctionKey,
    EModifierKey,
    EKey,
    KeyPress,
} from './keys';
