/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Root component for the entire application.
 */
import TopBar from '@/components/TopBar';
import Toolbox from '@/components/Toolbox';
import SchematicDisplay from '@/components/SchematicDisplay';
import Oscilloscope from './components/Oscilloscope';

function App() {
    return <main id='electromatic-app'>
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
