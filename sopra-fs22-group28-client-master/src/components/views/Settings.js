import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Settings.scss';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import {api} from "../../helpers/api";
import Lobby from "../../models/Lobby";
import {setGlobalState, useGlobalState} from "../../App";

const Checkbox = ({label, id, value, onChange}) => {
    return (
        <label>
            <input type="checkbox" id={id} defaultChecked={value} onChange={onChange}/>
            {label}
        </label>
    );
};
const NumberInput = ({label, id, value, onChange, min, max, step}) => {
    return (
        <label>
            <input type="number" id={id} defaultValue={value} onChange={onChange} min={min} max={max} step={step}/>
            {label}
        </label>
    );
};

async function refresh() {
    const response = await api.get('/lobbies/' + localStorage.getItem('lobbyID'));
    setGlobalState("lobby", new Lobby(response.data))
}

const Settings = () => {
    let [lobby, setLobby] = useState(null);
    lobby = useGlobalState("lobby")[0]
    setLobby = (l1) => {
        setGlobalState("lobby", l1)
    }
    if (lobby.id == null) {
        refresh().then(r => r)
    }
    lobby = useGlobalState("lobby")[0]
    console.log(lobby)
    const [rounds, setRounds] = useState(lobby.rounds);
    const [roundDuration, setRoundDuration] = useState(lobby.roundDuration);
    const history = useHistory();

    const toLobbyDiscard = () => {
        history.push('/lobby/{id}');
    };

    const toLobbySave = async () => {
        try {
            const requestBody = JSON.stringify({
                "rounds": document.getElementById("noRounds").value,
                "roundDuration": document.getElementById("timeRound").value,
                "hostToken": localStorage.getItem('hostToken'),
                "categoryCountriesActive": document.getElementById("countryCheckbox").checked,
                "categoryMunicipalityActive": document.getElementById("municipalityCheckbox").checked,
                "categoryCitiesActive": document.getElementById("cityCheckbox").checked,
                "categoryRiversActive": document.getElementById("riverCheckbox").checked,
            });
            const response = await api.patch('/lobbies/' + localStorage.getItem('lobbyID'), requestBody);
            setLobby(new Lobby(response.data))
            setGlobalState("lobby", new Lobby(response.data))
            history.push('/lobby/' + lobby.id);
        } catch (error) {
            alert(`Something went wrong during saving the changes to the lobby :(` + error.toString());
        }
    };

    return (
        <div>
            <div className="settings col-1">
                <div className="settings row-1">
                    <div className="settings title">
                        <h1>Modify Game Settings</h1>
                    </div>
                </div>
                <div className="settings row-2">
                    <div className="settings block-middle">
                        <div>
                            Rounds
                            <NumberInput
                                value={lobby.rounds}
                                id='noRounds'
                                min={1}
                                max={10}
                                step={1}
                            />
                        </div>
                        <p></p>
                        <div>
                            Round Time
                            <NumberInput
                                value={lobby.roundDuration}
                                id='timeRound'
                                min={1}
                                max={10}
                                step={1}
                            />
                        </div>
                        <p></p>
                        <Checkbox
                            label="City"
                            value={lobby.categoryCitiesActive}
                            id='cityCheckbox'
                        />
                        <Checkbox
                            label="Country"
                            value={lobby.categoryCountriesActive}
                            id="countryCheckbox"
                        />
                        <Checkbox
                            label="River"
                            value={lobby.categoryRiversActive}
                            id="riverCheckbox"
                        />
                        <Checkbox
                            label="Municipality"
                            value={lobby.categoryMunicipalityActive}
                            id="municipalityCheckbox"
                        />
                    </div>
                </div>
                <div className="settings row-3">
                    <div className="settings button">
                        <Button
                            width="300%"
                            onClick={() => toLobbyDiscard()}
                        >
                            Discard
                        </Button>
                    </div>
                </div>
                <div className="settings row-4">
                    <div className="settings button">
                        <Button
                            width="300%"
                            onClick={() => toLobbySave()}
                        >
                            Save changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Settings;