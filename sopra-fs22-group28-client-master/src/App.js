import Header from "components/views/Header";
import AppRouter from "components/routing/routers/AppRouter";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
import {createGlobalState} from 'react-hooks-global-state';
import Lobby from "./models/Lobby";

const initialState = {lobby: new Lobby()};
const {setGlobalState, useGlobalState} = createGlobalState(initialState);
export {useGlobalState, setGlobalState}

const App = () => {
    const [lobby, setLobby] = useGlobalState('lobby');
    return (
        <div>
            <Header height="100"/>
            <AppRouter/>
        </div>
    );
};

export default App;
