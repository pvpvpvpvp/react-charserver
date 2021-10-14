import {Route} from 'react-router-dom';

import RouterHomePage from './components/RouterHomePage';
import RouterAPIConnect from './components/RouterAPIConnect';
import RouterAPIMessageLoad from './components/RouterAPIMessageLoad';

function App() {
    return(
        <div>
            <RouterHomePage></RouterHomePage>
            <RouterAPIConnect></RouterAPIConnect>
            <RouterAPIMessageLoad></RouterAPIMessageLoad>
        </div>
    )
}

export default App;