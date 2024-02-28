import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {LetterButton} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Setup.scss";
import {Link} from 'react-router-dom';
import Letter from 'models/Letter';
import 'styles/views/RandomLetter.scss';
import Lobby from "./Lobby";



const RandomLetterGenerator = props => {
    // use react-router-dom's hook to access the history
    const history = useHistory();
    const [letter, setLetter] = useState(null);

    const getLetter= async () =>{
        try{const response=await api.get("/lobbies/" + "3")
        const letter=response.data.currentLetter
        console.log(letter)
    }catch (error){
        alert("letter not found")}
    }

    const generate = async (lobbyId) =>{

        try{

            const response = await api.get("/lobbies/" + lobbyId + "/letter");
            const letter = new Letter(response.data);
            localStorage.setItem("letter", letter[0]);
            setLetter(letter[0])
            

        }catch(error){
            alert("Letter could not be generated")}

    };

    const next = () => {
        history.push('/game');
    }

    const [clicked, setClicked] = useState(true);
    useEffect(() => {
        if (clicked){
            const timeout =
            setTimeout(() => history.push('/game'), 2000);
        }
      }, []);

    return (
        <div className="letter container">
        <p>
            <h1>
                PRESS
            </h1>
        </p>
        <p>
            <LetterButton
            onClick={() => generate(localStorage.getItem('lobbyID'))}>

            </LetterButton>
        </p>
        <p>
            <h1>
                FOR LETTER
            </h1>
        </p>
    </div>
    );
}
export default RandomLetterGenerator;