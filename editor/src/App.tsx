/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Root component for the entire application.
 */
import { AppStateProvider } from './state/provider';

import TopBar from '@/components/TopBar';
import Toolbox from '@/components/Toolbox';
import SchematicDisplay from '@/components/SchematicDisplay';
import Oscilloscope from './components/Oscilloscope';

function App() {
    return <AppStateProvider>
        <main id='electromatic-app'>
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
    </AppStateProvider>
}
export default App;
