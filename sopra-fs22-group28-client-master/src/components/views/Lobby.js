import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import {InfoButton} from 'components/ui/Button';
import {SettingButton} from 'components/ui/Button';
import 'styles/views/Lobby.scss';
import {api, handleError} from 'helpers/api';
import BaseContainer from "../ui/BaseContainer";
import {Spinner} from '../ui/Spinner';
import PropTypes from "prop-types";
import {setGlobalState} from "../../App";

const Player = ({user}) => (
    <div className="player container">
        <div className="player username">{user.name}</div>
    </div>
);
Player.propTypes = {
    user: PropTypes.object
};

const Lobby = props => {

    const history = useHistory();
    const [users, setUsers] = useState(null);

    const toGame = async () => {
        try {
            const lobbyID = localStorage.getItem('lobbyID');
            const hostToken = localStorage.getItem('hostToken')
            const roundStarted = true;
            const requestBody = JSON.stringify({lobbyID, hostToken, roundStarted});
            const response = await api.post('/lobbies/' + lobbyID + '/startRound', requestBody);
            history.push('/game');
        } catch (error) {
            alert("something went wrong:" + error);
        }
    };
    const toInfo = () => {
        history.push('/infoLobby');
    };

    const toSettings = () => {
        history.push('/settings')
    };

    let link = window.location.host + '/newPlayer/' + localStorage.getItem('lobbyID');


    useEffect(() => {
        async function fetchData() {
            try {
                const id = localStorage.getItem('lobbyID');
                const response = await api.get('/lobbies/' + id + '/users');
                setUsers(response.data);
                console.log(response.data)
            } catch (error) {
                console.log(error)
            }

        }

        fetchData().then(r => r)
        const intervalId = setInterval(() => {
            fetchData().then(r => r)
        }, 1000) // in milliseconds
        return () => clearInterval(intervalId)
    }, []);
    useEffect(() => {
        // redirect to game if round has been started by host
        async function checkIfLobbyHasStarted() {
            try {
                const id = localStorage.getItem('lobbyID');
                const response = await api.get('/lobbies/' + id + '/gameRunning');
                console.log(response.data)
                try {
                    if (response.data.gameRunning) {
                        localStorage.setItem("refreshLobby","true")
                        history.push('/game')
                    }
                } catch (e) {
                    console.log(e)
                }

            } catch (e) {
                console.log(e)
            }
        }

        const intervalStart = setInterval(() => {
            checkIfLobbyHasStarted().then(r => r)
        }, 1000)
        return () => clearInterval(intervalStart)
    }, []);
    const copy = () => {
        navigator.clipboard.writeText(link).then(function (x) {
            alert("link copied to clipboard");
        });
    };

    let content = <Spinner/>;

    if (users) {
        content = (
            <div className="game user-list">
                <ul className=" game user-item">
                    {users.map(user => (
                        <Player user={user} key={user.id}/>
                    ))}
                </ul>
            </div>
        )
    }

    const host = localStorage.getItem('host')
    return (
        <div>
            <div className="lobby title">
                <h1>Lobby</h1>
            </div>
            <div className="lobby row-1">
                <div className="lobby col-1">
                    <div className="lobby block-left">
                        {content}
                    </div>
                </div>
                <div className="lobby col-2">
                    <div className="lobby block-right">
                        {link}
                    </div>
                    <div className="lobby copy-button">
                        <Button
                            onClick={() => copy()}>
                            copy invite link
                        </Button>
                    </div>
                    {localStorage.getItem('hostToken')
                    && (!users
                    || users.length<2) &&

                    <div className="lobby message">
                        <h1>Waiting for at least one other player to join ...</h1>
                    </div>
                    }
                    {
                    !localStorage.getItem('hostToken')
                    && 
                    <div className="lobby message">
                        <h1>Waiting for Lobby Host to start the Game ...</h1>
                    </div>
                    }
                </div>
            </div>
            <div className="lobby row-2">
                <div className="lobby info-container">
                    <InfoButton
                        onClick={() => toInfo()}>
                        Info
                    </InfoButton>
                </div>
                {
                    localStorage.getItem('hostToken') &&
                    <div className="lobby setting-container">
                        <SettingButton
                            onClick={() => toSettings()}>
                            Settings
                        </SettingButton>
                    </div>
                }
                {localStorage.getItem('hostToken')
                    && (users && users.length>=2) &&

                    <div className="lobby button">
                        <Button
                            width="300%"
                            onClick={() => toGame()}
                        >
                            Start Game
                        </Button>
                    </div>
                } 
            </div>
        </div>
    )

}
export default Lobby;

