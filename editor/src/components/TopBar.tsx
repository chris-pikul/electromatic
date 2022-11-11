/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Provides the top-most bar for the entire application.
 */

import './TopBar.scss';
export const ApplicationTopBar = () => {
    return <header id='eme-topbar' className='plastic'>
        <menu>
            <li><u>F</u>ile</li>
            <li><u>E</u>dit</li>
            <li><u>V</u>iew</li>
        </menu>
        <h1>Electromatic <span id='eme-version'>v0.1.0</span></h1>
    </header>
};
export default ApplicationTopBar;