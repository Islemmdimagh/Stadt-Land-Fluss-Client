import React, {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import 'styles/views/Result.scss';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import {api, handleError} from "../../helpers/api";
import {Spinner} from "../ui/Spinner";
import {useHistory} from "react-router-dom";

let CATEGORIES = {
    1: "City: ",
    2: "Country: ",
    3: "River: ",
    4: "Municipality: ",
    // Todo: Get the name of the custom categories - either by api call or by storing them in localstorage somewhere
    //  where the lobby details are requested anyway - Lobby.js or Game, for example
    5: "Custom 1",
    6: "Custom 2",
    7: "Custom 3"
}
let intervalStart;

async function voteOverride(answerID) {
    let playerToken = localStorage.getItem("playerToken")
    const requestBody = JSON.stringify({
        "playerToken": playerToken,
        "answerID": answerID,
    });
    const response = await api.post('/answers/'+answerID+'/submitVote', requestBody);
    alert("your vote has been cast. You will see the voting results after the game.")
    // i did not find a way to remove the button that was clicked with react :(
    document.getElementById("answerVoteButton" + answerID).remove()

}

function Answer(props) {
    let className = "invalidAnswer";
    let checkMark = "❌"
    if (props.answer.valid) {
        className = "validAnswer";
        checkMark = "✅";
    }
    if ([5,6,7].includes(props.answer.category)) {
        className = "votedAnswer";
        checkMark = "❔";
    }
    let infoString = <div><Button onClick={() => voteOverride(props.answer.id)} id={"answerVoteButton"+props.answer.id}>vote</Button></div>;
    if (props.answer.valid) {
        infoString = <div><a href={props.answer.wikipediaLink} target={"_blank"}>📖</a></div>
    }
    return (
        <ul>
            <li key={props.answer.id} className={"result row-0 "+className}>
                {checkMark}&nbsp;<b>{props.answer.categoryVerbose}:</b>&nbsp;{props.answer.answer}&nbsp;-&nbsp;{infoString}
            </li>
        </ul>
    )
}

function Player(props) {
    return (
        <div className="result answers">
            <h1>{props.name}</h1>
            <div className="result row-0">
                <ul>
                        {props.answers.map(answer => (
                            <Answer key={answer.id} answer={answer} />
                        ))}
                </ul>
            </div>
        </div>
    );
}

const Result = props => {
    const history = useHistory();
    localStorage.setItem("refreshLobby", "true")
    let [players, setPlayers] = useState(null);
    useEffect(() => {
        async function fetchData() {
            try {
                let lobbyID = localStorage.getItem("lobbyID");
                // quick-n-dirty fix: as we do not know after redirecting whether the server processed every
                // answer already we wait 3 seconds - by then all answers are surely processed and submitted
                // get answers grouped by player from endpoint
                await new Promise(resolve => setTimeout(resolve, 3000));
                const response = await api.get('/lobbies/' + lobbyID + '/answersOfCurrentLetter');
                setPlayers(response.data)
            } catch (error) {
                console.error(`Something went wrong while fetching the answers: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        // check if host started the next round
        // todo: this does not need to spam the server when user is host
        async function goToNextRound() {
            try {
                const id = localStorage.getItem('lobbyID');
                const response = await api.get('/lobbies/' + id + '/submissionOpen');
                try {
                    if (response.data.submissionOpen) {
                        history.push('/game');
                    }
                } catch (e) {
                    console.log(e)
                }
            } catch (e) {
                console.log(e)
            }
        }
        intervalStart = setInterval(() => {
            goToNextRound().then(r => r)
        }, 1000)
        return () => clearInterval(intervalStart)
    }, []);

    let content = <Spinner/>;

    async function startRound() {
        const id = localStorage.getItem('lobbyID');
        const hostToken = localStorage.getItem('hostToken');
        const roundStarted = true;
        const requestBody = JSON.stringify({id, hostToken, roundStarted});
        const response = await api.post('/lobbies/' + id + '/nextRound', requestBody);
        history.push('/game');
    }

    if (players) {
        let answers =  players.answers
        players = players.players.sort(function(a,b) { return parseFloat(a.id) - parseFloat(b.id) } );
        let nextRoundButton = ''
        if (localStorage.getItem('hostToken') != null) {
            nextRoundButton = (
                <div className="result button">
                    <Button onClick={startRound}>
                        Start next Round
                    </Button>
                </div>
            )
        } else {
            nextRoundButton = (
                <div className="result row-2">
                    <div className="result col-2">
                        <div className='result message'>
                            The host will start the next round
                        </div>
                    </div>
                </div>
            )
        }
        content = (
            <div>
                <div className="result title">
                    <h1>Round Results for Letter {answers[0].letter.toUpperCase()}</h1>
                </div>
                <div className="result row-1">
                    <div className='result col-2'>
                        <div className="result block-middle">
                                {
                                    players.map(player => (
                                    <Player name={player.name} key={player.id} answers={player.currentAnswers}/>
                                ))
                                }
                        </div>
                        <div>
                            {nextRoundButton}
                        </div>
                    </div>
                </div>
            </div>
        )
        return (
            <div>
                {content}
            </div>
        )
    }
    return (
        <div>
            <div className="result title">
                <h1>Waiting for Results of the other players</h1>
                {content}
            </div>
        </div>
    );
}
export default Result;