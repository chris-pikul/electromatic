/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Provides a drop-down style menu
 */
import { useState } from 'react';
import type { FC } from 'react';

import Icon from '../Icon';

import { UMenuItem, MenuItemType, MenuItemAction, MenuItemMenu, MenuItemToggle } from './types';

export interface MenuProps {
    items: Array<UMenuItem>;
};

const MenuEntryAction:FC<MenuItemAction> = ({ icon, label, hotkey, action }) => {
    const dispatch = useAppStateDispatch();

    const handleClick = () => action && dispatch(action());

    return <button className='menu-entry menu-entry-action' type='button' onClick={handleClick}>
        <Icon className='menu-icon' type={icon} />
        <span className='menu-label'>{ label }</span>
        <HotKeyList hotkey={hotkey} />
    </button>;
};

const MenuEntryToggle:FC<MenuItemToggle> = ({ icon, label, hotkey, action, reducer }) => {
    let active = false;
    if(reducer)
        active = reducer(useAppState());

    const dispatch = useAppStateDispatch();

    const handleClick = () => action && dispatch(action());

    return <button className={`menu-entry menu-toggle ${active && 'active'}`} type='button' onClick={handleClick}>
        { active ?
              <Icon className='menu-icon' type='check' />
            : <Icon className='menu-icon' type={icon} /> }
        <span className='menu-label'>{ label }</span>
        <HotKeyList hotkey={hotkey} />
    </button>;
};

const MenuEntryMenu:FC<MenuItemMenu> = ({ label, items }) => {
    const [ open, setOpen ] = useState(false);
    const toggle = () => setOpen(!open);

    return <div className='pos-rel menu-entry-submenu-wrapper' onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        <button className='menu-entry menu-entry-submenu' type='button' >
            <span className='menu-icon'></span>
            <span className='menu-label'>{ label }</span>
            <Icon className='menu-icon-expand' type='triangle-right' />
        </button>
        { open && <Menu items={items} /> }
    </div>;
};

const MenuEntry:FC<UMenuItem> = props => {
    switch(props.type) {
        case MenuItemType.ACTION:
            return <MenuEntryAction { ...props } />;
        case MenuItemType.DIVIDER:
            return <hr />;
        case MenuItemType.MENU:
            return <MenuEntryMenu { ...props } />;
        case MenuItemType.TOGGLE:
            return <MenuEntryToggle { ...props } />;
    }
};

import './Menu.scss';
import { HotKeyList } from './hotkey';
import { useAppState, useAppStateDispatch } from '@/state';
export const Menu:FC<MenuProps> = ({ items }) => {
    return <div className='menu-container plastic-abs'>
        { items.map((item, ind) => <MenuEntry key={ind} {...item} />) }
    </div>
};
export default Menu;