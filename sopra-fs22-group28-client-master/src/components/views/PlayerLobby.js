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

const Player = ({user}) => (
    <div className = "player container">
        <div className = "player username">{user.name}</div>
    </div>
);
Player.propTypes = {
    user: PropTypes.object
};
const Lobby = props => {

    const history = useHistory();
    const [users, setUsers] = useState(null);

    const ready = async () => {
        try{
            const lobbyID = localStorage.getItem('lobbyID');
            const hostToken = localStorage.getItem('token');
            let boo = false;
            while(boo) {
                const response = await api.get('/lobbies/' + lobbyID + '/gameIsRunning');
                boo = response.data;
                //implement a timeout that lasts for like 5 seconds until it checks again
            }
            localStorage.setItem('curround', 0);
            history.push('/randomLetter');
        }catch(error){

        }
    };

    const toInfo = () => {
        history.push('/infoLobby');
    };

    const toSettings = () => {
        alert('you are not the host');
    };

    let link = window.location.host +'/newPlayer/' + localStorage.getItem('lobbyID');

    const copy = () => {
        navigator.clipboard.writeText(link);
        alert("link copied to clipboard");
    };

    useEffect(()=>{
        async function fetchData(){
            try{
                const id = localStorage.getItem('lobbyID');
                const response = await api.get('/lobbies/' + id +'/users');
                setUsers(response.data);
                console.log(response.data)
            }catch(error){
                alert("userlist unavailable");
            }
        }
        fetchData();
    },[]);

    let content = <Spinner/>;

    if (users){
        content = (
            <div className="game">
                <ul className="game user-list">
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
            <div className="lobby block-left">
                {host}
                {content}
            </div>
            <div className="lobby block-right">
                {link}
            </div>
            <div className="lobby copy-button">
                <Button
                    onClick={()=>copy()}>
                    copy
                </Button>
            </div>
            <div className="lobby button">
                <Button
                    width="300%"
                    onClick={() => toSettings()}
                >
                    Start Game
                </Button>
            </div>
            <div className="lobby info-container">
                <InfoButton
                    onClick={() => toInfo()}>
                    Info
                </InfoButton>
            </div>
            <div className="lobby setting-container">
                <SettingButton
                    onClick={() => toSettings()}>
                    Setting
                </SettingButton>
            </div>
            <div className="lobby button">
                <Button
                    width="300%"
                    onClick={() => ready()}
                >
                    Ready!
                </Button>
            </div>
        </div>
    )
}
export default Lobby;

