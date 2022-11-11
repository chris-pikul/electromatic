/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Provides the left-hand toolbox that features available components and the
 * current properties of the selected component.
 */
import PartsSection from './PartsSection';
import PropertiesSection from './PropertiesSection';

import './Toolbox.scss';
export const Toolbox = () => {
    return <aside id='eme-toolbox'>
        <PartsSection />
        <PropertiesSection />
    </aside>
};
export default Toolbox;