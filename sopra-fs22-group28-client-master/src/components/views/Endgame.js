import React, {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import 'styles/views/Setup.scss';
import 'styles/views/Endgame.scss';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import {api, handleError} from "../../helpers/api";
import {Spinner} from "../ui/Spinner";
import {useHistory} from "react-router-dom";
import podium1 from "./podium_1.png";
import podium2 from "./podium_2.png";
import podium3 from "./podium_3.png";

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

function PlayerAnswersByLetter(answersByLetter) {
    return (
        <div className="endgame row-3">
            <div className="endgame row-4">
                <h1>Answers</h1>
            </div>
            <div className="endgame row-3">
                {
                    Object.keys(answersByLetter.answersByLetter).map((key, index) => (
                            <div className="endgame col-5"><h1>Letter: {key}</h1>
                                {
                                    answersByLetter.answersByLetter[key].map(players => (
                                        Object.keys(players).map((key2, index2) => (
                                            <Player  playerName = {key2} playerAnswers={players[key2]}/>
                                        )
                                    )))
                                }
                            </div>
                        )
                    )

                }
            </div>

        </div>
    )
}

function Answer(props) {
    // to avoid bugs when host play another round where he is not the host
    localStorage.removeItem("hostToken")
    let className = "invalidAnswer";
    let checkMark = "❌"
    if (props.answer.valid) {
        className = "validAnswer";
        checkMark = "✅";
    }
    let wikipediaLink = <div></div>;
    if (props.answer.wikipediaLink) {
        wikipediaLink = <a href={props.answer.wikipediaLink} target={"_blank"}>📖</a>
    }
    else {
        wikipediaLink = <div>voted</div>
    }
    return (
        <ul>
            <li key={props.answer.id} className={"endgame row "+className}>
                {checkMark}&nbsp;<b>{props.answer.categoryVerbose}</b>: {props.answer.answer}&nbsp;-&nbsp;{wikipediaLink}
            </li>
        </ul>
    )
}

function Player({playerName, playerAnswers}) {
    return (
        <div>
            <h2>{playerName}</h2>
            <ul key={playerName}>
                {playerAnswers.map(answer => (
                    <Answer key={answer.id} answer={answer}/>
                ))}
            </ul>

        </div>
    );
}

const Endgame = props => {
    const history = useHistory();

    function toNewGame() {
        history.push('/')
    }

    const [results, setResults] = useState(null);
    const [answersByLetter, setAnswersByLetter] = useState(null);
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get('/lobbies/' + localStorage.getItem("lobbyID") + '/endgame');
                setResults(response.data.players);
                const response2 = await api.get('/lobbies/' + localStorage.getItem("lobbyID") + '/answersGroupedByLetter');
                setAnswersByLetter(response2.data)
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();
    }, []);
    let content = <Spinner/>;

    if (results) {
        // sort players by points descending
        results.sort((a, b) => parseFloat(b.points) - parseFloat(a.points));
        let firstPlace = {name: "", "points": null};
        let secondPlace = {name: "", "points": null};
        let thirdPlace = {name: "", "points": null};
        if (results.length > 0) {
            firstPlace = results[0]
        }
        if (results.length > 1) {
            secondPlace = results[1]
        }
        if (results.length > 2) {
            thirdPlace = results[2]
        }
        content = (
            <div>
                <div className="endgame row-1">
                    <div className="endgame col-4">
                        <div className='endgame next-game'>
                            <Button
                                onClick={toNewGame}>
                                Create New Game
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="endgame row-2">
                    <div className="endgame col-2">
                        <div>
                            <div className='endgame second'>
                                {secondPlace.name} - {secondPlace.points} Points
                            </div>
                        </div>
                        <div>
                            <img src={podium2} alt="podium"/>
                        </div>
                    </div>
                    <div className="endgame col-1">
                        <div>
                            <div className='endgame first'>
                                {firstPlace.name} - {firstPlace.points} Points
                            </div>
                        </div>
                        <div>
                            <img src={podium1} alt="podium"/>
                        </div>
                    </div>
                    {results.length > 2 &&
                        <div className="endgame col-3">
                            <div>
                                <div className='endgame third'>
                                    {thirdPlace.name} - {thirdPlace.points} Points
                                </div>
                            </div>
                            <div>
                                <img src={podium3} alt="podium"/>
                            </div>
                        </div>

                    }
                </div>
                <div>
                    {
                        answersByLetter &&
                        <div>
                            <PlayerAnswersByLetter answersByLetter={answersByLetter}/>
                        </div>

                    }
                </div>
            </div>
        )
    }
    return (
        <div>
            <div className="pyro">
                <div className="before">
                </div>
                <div className="after">
                </div>
            </div>
            <div className="endgame title">
                <h1>And the winner is...</h1>
            </div>
            {content}
        </div>
    );
}
export default Endgame;