/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Left-hand toolbox section for component selection
 */
import type { FC } from 'react';
import SectionHeader from './SectionHeader';

interface PartTagProps {
    id:string;
    label:string;
    description:string;
    symbol?:string;
    classification:string;
    tags:string[];
};

const PartTag:FC<PartTagProps> = ({
    id,
    label,
    description,
    symbol,
    classification,
    tags,
}) => (<div className='part-tag'>
    <div className='part-tag-top'>
        <h3>{ label }</h3>
        <div className='img-placeholder' />
    </div>
    <p>{ description }</p>
    <div className='part-tag-bottom'>
        <i>{ classification }</i>
    </div>
</div>);

const mockLibrary:PartTagProps[] = [
    {
        id: 'resistor',
        label: 'Resistor',
        description: 'Test component, here will be the description of the part for the catalog.',
        classification: 'passive/resistor',
        tags: [ 'passive', 'resistance', 'resistor' ],
    },
    {
        id: 'capacitor',
        label: 'Capacitor',
        description: 'Test component, here will be the description of the part for the catalog.',
        classification: 'passive/capacitor',
        tags: [ 'passive', 'capacitance', 'capacitor', 'non-polar'],
    },
    {
        id: 'capacitor-electrolytic',
        label: 'Electrolytic Capacitor',
        description: 'Test component, here will be the description of the part for the catalog.',
        classification: 'passive/capacitor',
        tags: [ 'passive', 'capacitance', 'capacitor', 'polar'],
    },
    {
        id: 'diode',
        label: 'Diode',
        description: 'Test component, here will be the description of the part for the catalog.',
        classification: 'active/diode',
        tags: [ 'active', 'diode' ],
    },
];

import './PartsSection.scss';
export const PartsSection = () => {
    return <section id='eme-toolbox-parts'>
        <SectionHeader title='Components' />
        <div id='eme-toolbox-parts-content' className='plastic'>
            <div>Search</div>
            <ul id='eme-toolbox-parts-list'>
                { mockLibrary.map(part => <li key={part.id} className='eme-toolbox-part'>
                    <PartTag {...part} />
                </li>)}
            </ul>
        </div>
    </section>;
};
export default PartsSection;
