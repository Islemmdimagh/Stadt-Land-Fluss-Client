import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import GameRouter from "components/routing/routers/GameRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Homepage from "components/views/Homepage";
import Setup from "components/views/Setup";
import Lobby from "components/views/Lobby";
import Info from "components/views/Info";
import InfoLobby from "components/views/InfoLobby"
import RandomLetter from "components/views/RandomLetter";
import Settings from "components/views/Settings";
import NewPlayer from "components/views/NewPlayer";
import Result from "components/views/Result";
import Endgame from 'components/views/Endgame';


/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/homepage">
                    <Homepage/>
                </Route>
                <Route exact path="/">
                    <Redirect to="/homepage"/>
                </Route>

                <Route path="/game">
                    <GameRouter base="/game"/>
                </Route>
                <Route path="/setup">
                    <Setup/>
                </Route>
                <Route path="/lobby">
                    <Lobby/>
                </Route>
                <Route path="/info">
                    <Info/>
                </Route>
                <Route path="/settings">
                    <Settings/>
                </Route>
                <Route path="/infoLobby">
                    <InfoLobby/>
                </Route>
                <Route path="/randomLetter">
                    <RandomLetter/>
                </Route>
                <Route path="/newPlayer">
                    <NewPlayer/>
                </Route>
                <Route path="/results">
                    <Result/>
                </Route>
                <Route path="/endgame">
                    <Endgame/>
                </Route>
            </Switch>
        </BrowserRouter>

    );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
