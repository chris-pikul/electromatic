/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Types for menu building
 */
import type { EIconType } from '../Icon';
import type { HotKey } from './hotkey';

export const MenuItemType = {
    ACTION: 'action',
    DIVIDER: 'divider',
    MENU: 'menu',
    TOGGLE: 'toggle',
} as const;
export type EMenuItemType = typeof MenuItemType[keyof typeof MenuItemType];

export interface MenuItem {
    type: EMenuItemType;
    key ?: (string | number);
}

export interface MenuItemAction extends MenuItem {
    type: (typeof MenuItemType['ACTION']);

    icon?: EIconType;
    label: string;
    hotkey?: HotKey;
}

export interface MenuItemDivider extends MenuItem {
    type: (typeof MenuItemType['DIVIDER']);
}

export interface MenuItemMenu extends MenuItem {
    type: (typeof MenuItemType['MENU']);

    label: string;
    items: Array<UMenuItem>;
}

export interface MenuItemToggle extends MenuItem {
    type: (typeof MenuItemType['TOGGLE']);

    icon?: EIconType;
    label: string;
    hotkey?: HotKey;
}

export type UMenuItem = MenuItemAction 
    | MenuItemDivider
    | MenuItemMenu
    | MenuItemToggle
    ;
