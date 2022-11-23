/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Provides the top-most bar menu.
 */
import RootMenuButton from './RootMenuButton';

import { ActionSetAppTheme } from '@/state/actions';

import type { UMenuItem } from './types';
import type { HotKey } from './hotkey';

export interface RootMenu {
    label:string;
    hotkey:HotKey;
    items:Array<UMenuItem>;
}

const menus:Array<RootMenu> = [
    {
        label: 'File',
        hotkey: 'F',
        items: [
            { type: 'action', icon: 'new-document', label: 'New', hotkey: [ 'ctrl', 'n' ] },
            { type: 'action', icon: 'folder-open', label: 'Open', hotkey: [ 'ctrl', 'o' ] },
            { type: 'action', icon: 'save', label: 'Save', hotkey: [ 'ctrl', 's' ]},
            { type: 'divider' },
            { type: 'action', icon: 'file-import', label: 'Import from Text', },
            { type: 'menu', label: 'Export', items: [
                { type: 'action', label: 'Export as Text' },
                { type: 'action', label: 'Export as Image', hotkey: [ 'ctrl', 'e' ] },
                { type: 'action', label: 'Export as SVG', hotkey: [ 'ctrl', 'shift', 'e' ] },
            ]},
            { type: 'action', icon: 'print', label: 'Print', hotkey: [ 'ctrl', 'p' ]},
        ],
    },
    {
        label: 'Edit',
        hotkey: 'E',
        items: [
            { type: 'action', icon: 'undo', label: 'Undo', hotkey: [ 'ctrl', 'z' ] },
            { type: 'action', icon: 'redo', label: 'Redo', hotkey: [ 'ctrl', 'shift', 'z' ]},
            { type: 'divider' },
            { type: 'action', icon: 'cut', label: 'Cut', hotkey: [ 'ctrl', 'x' ]},
            { type: 'action', icon: 'copy', label: 'Copy', hotkey: [ 'ctrl', 'c' ]},
            { type: 'action', icon: 'paste', label: 'Paste', hotkey: [ 'ctrl', 'v' ]},
            { type: 'action', label: 'Duplicate', hotkey: [ 'ctrl', 'd' ]},
            { type: 'divider' },
            { type: 'action', icon: 'select-all', label: 'Select All', hotkey: [ 'ctrl', 'a' ]},
            { type: 'action', icon: 'de-select', label: 'De-Select', hotkey: [ 'ctrl', 'shift', 'a' ]},
        ],
    },
    {
        label: 'View',
        hotkey: 'V',
        items: [
            { type: 'toggle', icon: 'grid', label: 'Show Grid', hotkey: [ 'ctrl', 'g' ] },
            { type: 'divider' },
            { type: 'action', icon: 'zoom-in', label: 'Zoom In', hotkey: [ '+' ]},
            { type: 'action', icon: 'zoom-out', label: 'Zoom Out', hotkey: [ '-' ]},
            { type: 'action', icon: 'center-focus', label: 'Fit In View' },
            { type: 'action', label: 'Reset Zoom', hotkey: [ 'z' ]},
            { type: 'action', label: 'Reset View', hotkey: [ 'x' ]},
            { type: 'divider' },
            { type: 'menu', label: 'Set Application Theme', items: [
                { type: 'toggle', icon: 'automagic', label: 'Automatic', action: () => ActionSetAppTheme('auto'), reducer: (state) => (state.appTheme === 'auto') },
                { type: 'toggle', icon: 'light', label: 'Light', action: () => ActionSetAppTheme('light'), reducer: (state) => (state.appTheme === 'light') },
                { type: 'toggle', icon: 'dark', label: 'Dark', action: () => ActionSetAppTheme('dark'), reducer: (state) => (state.appTheme === 'dark') },
            ] },
            { type: 'action', icon: 'palette', label: 'Set Schematic Theme' },
            { type: 'action', icon: 'palette', label: 'Set Scope Theme' },
            { type: 'toggle', icon: 'fullscreen', label: 'Toggle Fullscreen', hotkey: [ 'ctrl', 'f' ], 
                reducer: ({ isFullscreen }) => (isFullscreen),
                callback: () => toggleFullScreen(),
            },
        ],
    },
    {
        label: 'About',
        hotkey: 'A',
        items: [
            { type: 'action', icon: 'heart', label: 'Support The Developer'},
            { type: 'action', icon: 'info', label: 'About Electromatic' },
            { type: 'action', icon: 'link', label: 'Visit GitHub Repository' },
            { type: 'action', icon: 'bug', label: 'Report Bug'},
        ],
    },
];

import './RootMenu.scss';
import { toggleFullScreen } from '@/fullscreen';
export const RootMenu = () => {
    return <ul className='menu-root'>
        { menus.map( (item, ind) => {
            return <li key={item.label+ind}>
                <RootMenuButton { ...item} />
            </li>
        }) }
    </ul>
}
export default RootMenu;
