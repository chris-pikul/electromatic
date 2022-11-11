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

function App() {
    return <main id='electromatic-app'>
        <TopBar />
        <div id='eme-main'>
            <Toolbox />
        </div>
    </main>
}
export default App;
