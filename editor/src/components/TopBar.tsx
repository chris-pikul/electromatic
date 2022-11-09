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
    return <header id='eme-topbar'>
        <h1>Electromatic - Circuit Simulator</h1>
    </header>
};
export default ApplicationTopBar;