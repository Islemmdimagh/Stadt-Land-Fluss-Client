import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import {api} from 'helpers/api';
import 'styles/views/NewPlayer.scss';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import PropTypes from "prop-types";
import User from 'models/User';

const FormField = props => {
    return (
        <div className="newplayer form">
            <label>
                {props.label}
            </label>
            <p></p>
            <input
                placeholder="enter here.."
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};


const NewPlayer = props => {

    const [name, setName] = useState(null);
    const history = useHistory();

    const getLobbyID = () => {
        const url = window.location.href;
        const lastSegment = url.split("/").pop();
        localStorage.setItem('lobbyID', lastSegment);
    }

    const addNewPlayer = async () => {
        let response;
        getLobbyID();
        const lobbyId = localStorage.getItem('lobbyID');
        const requestBody = JSON.stringify({name, lobbyId});
        response = await api.post('/lobbies/' + lobbyId + '/users', requestBody).catch(
            function (error) {
                if (error.response) {
                    alert(error.response.data.message)
                }
            }
        );
        localStorage.setItem('playerToken', response.data.playerToken);
        history.push('/lobby/' + lobbyId);
    };

    return (
        <div>
            <div className="newplayer title">
                <h1>Enter Username</h1>
            </div>
            <div className="newplayer block-middle">
                <div className="setup form">
                    <FormField
                        label="Username"
                        onChange={un => setName(un)}
                    />
                </div>
            </div>

            <div className="newplayer button">
                <Button
                    disabled={!name}
                    width="300%"
                    onClick={() => addNewPlayer()}
                >
                    Join Lobby
                </Button>
            </div>
        </div>
    )
}
export default NewPlayer;