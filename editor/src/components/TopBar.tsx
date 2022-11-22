/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Provides the top-most bar for the entire application.
 */
import RootMenu from './menu/RootMenu';

import './TopBar.scss';
export const ApplicationTopBar = () => {
    return <header id='eme-topbar' className='plastic'>
        <RootMenu />
        <svg className='separator-horz' viewBox='0 0 100 50' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'>
            <rect x='0' y='0' width='100%' height='10' />
            <rect x='0' y='20' width='100%' height='10' />
            <rect x='0' y='40' width='100%' height='10' />
        </svg>
        <h1>Electromatic <span id='eme-version'>v0.1.0</span></h1>
    </header>
};
export default ApplicationTopBar;