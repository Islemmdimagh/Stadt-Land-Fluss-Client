import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import Answer from 'models/Answer'
import {setGlobalState, useGlobalState} from "../../App";
import Lobby from "../../models/Lobby";


async function refresh() {
    const response = await api.get('/lobbies/' + localStorage.getItem('lobbyID'));
    setGlobalState("lobby", new Lobby(response.data))
    localStorage.setItem("refreshLobby", "false")
}

function PlayerList(props) {
    if (props.players) {
        return (props.players.map(player => {
            return <div className='game user-item' key={player.id}>{player.name}</div>;
        }))
    }
    return "";
}

var intervalStart;
var lobbyGlob;
const Game = () => {
    const history = useHistory();
    const [buttonVisible, setButtonVisible] = React.useState(true);
    const [controlsVisible, setControlsVisible] = React.useState(true);


    // check if game is finished already
    async function checkIfGameIsFinished() {
        try {
            const id = localStorage.getItem('lobbyID');
            const response = await api.get('/lobbies/' + id + '/gameFinished');
            try {
                if (response.data.gameFinished) {
                    history.push('/endgame')
                }
            } catch (e) {
                console.log(e)
            }
        } catch (e) {
            console.log(e)
        }
    }
    checkIfGameIsFinished().then(r => r)



    async function submitAndRedirect() {
        setControlsVisible(false);
        await submitAnswers().then(
            r => (history.push('/results'))
        );
    }
    useEffect(() => {
        // submit the answers if another player has submitted already :/
        async function submitIfAnotherPlayerWasFaster() {
            try {
                const id = localStorage.getItem('lobbyID');
                const response = await api.get('/lobbies/' + id + '/submissionOpen');
                try {
                    if (!response.data.submissionOpen) {
                        await submitAndRedirect();
                    }
                } catch (e) {
                    console.log(e)
                }
            } catch (e) {
                console.log(e)
            }
        }

        intervalStart = setInterval(() => {
            submitIfAnotherPlayerWasFaster().then(r => r)
        }, 1000)
        return () => clearInterval(intervalStart)
    }, []);

    // retrieve info over current lobby
    let [lobby, setLobby] = useState(null);
    if (useGlobalState("lobby")[0].currentLetter == null) {
        refresh().then(r => r)
    }
    // refresh everything when coming from result page
    if (localStorage.getItem("refreshLobby") === "true") {
        refresh().then(r => r)
    }
    lobby = useGlobalState("lobby")[0]
    lobbyGlob = lobby
    function getRequestBody(category, answer) {
        return JSON.stringify({
            "playerToken": localStorage.getItem('playerToken'),
            "category": category,
            "answer": answer
        });

    }


    async function submitAnswers() {
        // CITIES = 1;
        // COUNTRIES = 2;
        // RIVERS = 3;
        // MUNICIPALITY = 4;
        // CUSTOM1 = 5;
        // CUSTOM2 = 6;
        // CUSTOM3 = 7;
        clearInterval(intervalStart);
        // BUG: LOBBY IS MISSING HERE
        if (lobbyGlob.categoryCitiesActive) {
            console.log("SUBMITTINGCITIES")
            let answerCity = document.getElementById('answerCity').value;
            document.getElementById('answerCity').value = '';
            await api.post('/lobbies/' + localStorage.getItem('lobbyID') + '/submitAnswer', getRequestBody(
                1,
                answerCity
            ));

        }
        if (lobbyGlob.categoryRiversActive) {
            let answerRiver = document.getElementById('answerRiver').value;
            document.getElementById('answerRiver').value = '';
            await api.post('/lobbies/' + localStorage.getItem('lobbyID') + '/submitAnswer', getRequestBody(
                3,
                answerRiver
            ));
        }
        if (lobbyGlob.categoryCountriesActive) {
            let answerCountry = document.getElementById('answerCountry').value;
            document.getElementById('answerCountry').value = '';
            await api.post('/lobbies/' + localStorage.getItem('lobbyID') + '/submitAnswer', getRequestBody(
                2,
                answerCountry
            ));
        }
        if (lobbyGlob.categoryMunicipalityActive) {
            let answerMunicipality = document.getElementById('answerMunicipality').value;
            document.getElementById('answerMunicipality').value = '';
            await api.post('/lobbies/' + localStorage.getItem('lobbyID') + '/submitAnswer', getRequestBody(
                4,
                answerMunicipality
            ));
        }
        if (lobbyGlob.customCategory1) {
            let answerCustom1 = document.getElementById('answerCustom1').value
            document.getElementById('answerCustom1').value = '';
            await api.post('/lobbies/' + localStorage.getItem('lobbyID') + '/submitAnswer', getRequestBody(
                5,
                answerCustom1
            ));
        }
        if (lobbyGlob.customCategory2) {
            let answerCustom2 = document.getElementById('answerCustom2').value
            document.getElementById('answerCustom2').value = '';
            await api.post('/lobbies/' + localStorage.getItem('lobbyID') + '/submitAnswer', getRequestBody(
                6,
                answerCustom2
            ));
        }
        if (lobbyGlob.customCategory3) {
            let answerCustom3 = document.getElementById('answerCustom3').value
            document.getElementById('answerCustom3').value = '';
            await api.post('/lobbies/' + localStorage.getItem('lobbyID') + '/submitAnswer', getRequestBody(
                7,
                answerCustom3
            ));
        }
        return null;
    }

    return (
        <div>
            <div className="setup title" style={!controlsVisible ? {} : { display: 'none' }}>
                <h1>Submitting answers ...</h1>
                <Spinner/>
            </div>
            <div  style={controlsVisible ? {} : { display: 'none' }}>
                <div className="game row-1">
                    <div className="game col-1">
                        <div className='game letter'>
                            <h1>{lobby.currentLetter}</h1>
                        </div>
                    </div>
                    <div className='game col-2'>
                        <div className='game block'>
                            <table id={'answerTable'} className='game table'>
                                <thead>
                                <tr>
                                    {
                                        lobby.categoryCitiesActive &&
                                        <th className='game th'>
                                            City
                                        </th>
                                    }
                                    {
                                        lobby.categoryRiversActive &&
                                        <th className='game th'>
                                            River
                                        </th>
                                    }
                                    {
                                        lobby.categoryCountriesActive &&
                                        <th className='game th'>
                                            Country
                                        </th>
                                    }
                                    {
                                        lobby.categoryMunicipalityActive &&
                                        <th className='game th'>
                                            Municipality
                                        </th>
                                    }
                                    {
                                        lobby.customCategory1 &&
                                        <th className='game th'>
                                            {lobby.customCategory1}
                                        </th>
                                    }
                                    {
                                        lobby.customCategory2 &&
                                        <th className='game th'>
                                            {lobby.customCategory2}
                                        </th>
                                    }
                                    {
                                        lobby.customCategory3 &&
                                        <th className='game th'>
                                            {lobby.customCategory3}
                                        </th>
                                    }
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className='game td'>{lobby.categoryCitiesActive &&
                                        <input id={'answerCity'} label={'City'}/>}</td>
                                    <td className='game td'>{lobby.categoryRiversActive &&
                                        <input id={'answerRiver'} label={'River'}/>}</td>
                                    <td className='game td'>{lobby.categoryCountriesActive &&
                                        <input id={'answerCountry'} label={'Country'}/>}</td>
                                    <td className='game td'>{lobby.categoryMunicipalityActive &&
                                        <input id={'answerMunicipality'} label={'Municipality'}/>}</td>
                                    <td className='game td'>{lobby.customCategory1 &&
                                        <input id={'answerCustom1'} label={lobby.customCategory1}/>}</td>
                                    <td className='game td'>{lobby.customCategory2 &&
                                        <input id={'answerCustom2'} label={lobby.customCategory2}/>}</td>
                                    <td className='game td'>{lobby.customCategory3 &&
                                        <input id={'answerCustom3'} label={lobby.customCategory3}/>}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className='game row-2'>
                    <div className='game col-1'>
                        <div className='game player'>
                                <PlayerList players={lobby.players}/>
                        </div>
                    </div>
                    <div className='game col-3'>
                        <div className='game button'>
                            {buttonVisible &&
                                <Button onClick={submitAndRedirect} id={'submitButton'}>Send answers!</Button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Game;
