/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Left-hand toolbox section for component selection
 */
import SectionHeader from './SectionHeader';

import './PartsSection.scss';
export const PartsSection = () => {
    return <section id='eme-toolbox-parts'>
        <SectionHeader title='Components' />
        <div id='eme-toolbox-parts-content' className='plastic'>
            <div>Search</div>
            <ul id='eme-toolbox-parts-list'>

            </ul>
        </div>
    </section>;
};
export default PartsSection;
