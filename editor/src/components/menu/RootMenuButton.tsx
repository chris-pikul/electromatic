/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Provides the top-most bar menu button, which drives the entire sub-menu below.
 */
import { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';

import { HotKeyLabel } from './hotkey';

import type { RootMenu } from './RootMenu'; 

import Menu from './Menu';

import './RootMenuButton.scss';
export const RootMenuButton:FC<RootMenu> = ({
    label,
    hotkey,
    items,
}) => {
    const refContainer = useRef(null);
    const [ open, setOpen ] = useState(false);

    const toggleOpen = () => setOpen(!open);

    const handleDocClick = (evt:Event) => {
        if(!refContainer.current) return;
        const cur = refContainer.current as HTMLDivElement;

        if(evt.target !== cur && !cur.contains(evt.target as Node))
            setOpen(false);
    };

    useEffect(() => {
        if(refContainer.current && open)
            document.addEventListener('click', handleDocClick, true);

        return () => {
            if(refContainer.current)
                document.removeEventListener('click', handleDocClick, true);
        };
    }, [ open, refContainer ]);

    return <div ref={refContainer}> 
        <button className='menu-root-button' type='button' aria-haspopup='menu' onClick={toggleOpen}>
            <HotKeyLabel label={label} hotkey={hotkey} />
        </button>

        { open && <Menu items={items} />}
    </div>
};
export default RootMenuButton;