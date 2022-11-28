/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Provides the top-most bar menu.
 */
import RootMenuButton from './RootMenuButton';
import RootMenuEntries from './entries';

import './RootMenu.scss';
export const RootMenu = () => {
    return <ul className='menu-root'>
        { RootMenuEntries.map( (item, ind) => {
            return <li key={item.label+ind}>
                <RootMenuButton { ...item} />
            </li>
        }) }
    </ul>
}
export default RootMenu;
