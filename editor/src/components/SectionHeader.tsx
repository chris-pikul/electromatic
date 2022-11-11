/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Gives a title to a given section for the top header.
 */
import type { FC } from 'react';

export interface SectionHeaderProps {
    title:string;
}

import './SectionHeader.scss';
export const SectionHeader:FC<SectionHeaderProps> = ({
    title
}) => (<header className='section-header plastic'>
    <svg className='separator-horz' viewBox='0 0 100 50' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'>
        <rect x='0' y='0' width='100%' height='10' />
        <rect x='0' y='40' width='100%' height='10' />
    </svg>
    <h2>{ title }</h2>
    <svg className='separator-horz' viewBox='0 0 100 50' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'>
        <rect x='0' y='0' width='100%' height='10' />
        <rect x='0' y='40' width='100%' height='10' />
    </svg>
</header>);
export default SectionHeader;