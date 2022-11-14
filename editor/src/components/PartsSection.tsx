/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Left-hand toolbox section for component selection
 */
import { ChangeEventHandler, useState } from 'react';
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
    {
        id: 'inductor-air',
        label: 'Inductor (Air Core)',
        description: 'Test component, here will be the description of the part for the catalog.',
        classification: 'passive/inductor',
        tags: [ 'passive', 'inductor', 'air', 'core'],
    },
    {
        id: 'inductor-ferrite',
        label: 'Inductor (Ferrite Core)',
        description: 'Test component, here will be the description of the part for the catalog.',
        classification: 'passive/inductor',
        tags: [ 'passive', 'inductor', 'ferrite', 'core'],
    },
];
mockLibrary.sort((a, b) => {
    const comp = a.classification.localeCompare(b.classification);
    if(comp === 0)
        return a.label.localeCompare(b.label);
    return comp;
});

const SearchBar:FC<{ onChange: (val:string) => void }> = ({
    onChange
}) => {
    const [ curValue, setCurValue ] = useState('');

    const handleChange:ChangeEventHandler<HTMLInputElement> = (evt) => {
        setCurValue(evt.target.value);
        onChange(evt.target.value);
    }

    const handleClear = () => {
        setCurValue('');
        onChange('');
    }

    return <div className='input-search'>
        <div className='img-placeholder icon-prefix' />
        <div className='input-search-content'>
            <input type='text' placeholder='Search' value={curValue} onChange={handleChange} />
            { curValue !== '' && <button type='button' onClick={handleClear}>X</button> }
        </div>
    </div>
};

import './PartsSection.scss';
export const PartsSection = () => {
    const [ filter, setFilter ] = useState('');

    return <section id='eme-toolbox-parts'>
        <SectionHeader title='Components' />
        <div id='eme-toolbox-parts-content' className='plastic'>
            <SearchBar onChange={setFilter} />

            <ul id='eme-toolbox-parts-list'>
                { mockLibrary.filter(part => {
                    if(!filter || filter === '')
                        return true;

                    return part.tags.some(tag => tag.startsWith(filter));
                }).map(part => <li key={part.id} className='eme-toolbox-part'>
                    <PartTag {...part} />
                </li>)}
            </ul>
        </div>
    </section>;
};
export default PartsSection;
