/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Root component for the entire application.
 */
import { useEffect } from 'react';

import { useApplicationState } from '@/state';

import TopBar from '@/components/TopBar';
import Toolbox from '@/components/Toolbox';
import SchematicDisplay from '@/schematic/component';
import Oscilloscope from '@/components/Oscilloscope';
import { handleFullscreenChange } from './fullscreen';

function App() {
    const [ { appTheme }, dispatch ] = useApplicationState();

    useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        // Clean-up
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        }
    });

    let theme = 'theme-auto';
    if(appTheme === 'light')
        theme = 'theme-light';
    else if(appTheme === 'dark')
        theme = 'theme-dark';

    return <main id='electromatic-app' className={theme}>
        <TopBar />
        <div id='eme-main'>
            <Toolbox />
            <div id='eme-circuit'>
                <SchematicDisplay />
                
                <div id='eme-circuit-bottom'>
                    <div id='eme-circuit-settings'>
                        Simulation Settings
                    </div>
                    <Oscilloscope />
                </div>
            </div>
        </div>
    </main>
}
export default App;
