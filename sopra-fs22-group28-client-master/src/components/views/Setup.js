import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import {api} from 'helpers/api';
import 'styles/views/Setup.scss';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import PropTypes from "prop-types";
import Lobby from 'models/Lobby';
import {setGlobalState, useGlobalState} from 'App'

const FormField = props => {
    return (
        <div>
            <label>
                {props.label}
            </label>
            <input
                className='setup form'
                placeholder="enter here.."
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};
const Checkbox = ({label, id, value, onChange}) => {
    return (
        <label>
            <input type="checkbox" id={id} checked={value} onChange={onChange}/>
            {label}
        </label>
    );
};
const CategoryField = props => {
    return (
        <div className="setup form">
            <label>
                {props.label}
            </label>
            <input
                className='setup form'
                placeholder="Enter Custom Category ..."
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

CategoryField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
}

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};


const Setup = () => {

    const [rounds, setRounds] = useState(2);
    const [roundDuration, setRoundDuration] = useState(1);
    const [host, setHost] = useState(null);
    const [categoryCountriesActive, setCategoryCountriesActive] = useState(null);
    const [categoryMunicipalityActive, setCategoryMunicipalityActive] = useState(null);
    const [categoryRiversActive, setCategoryRiversActive] = useState(null);
    const [categoryCitiesActive, setCategoryCitiesActive] = useState(null);
    const [customCategory1, setCustomCategory1] = useState(null);
    const [customCategory2, setCustomCategory2] = useState(null);
    const [customCategory3, setCustomCategory3] = useState(null);
    let [lobby, setLobby] = useState(null);

    const handleCategoryCountriesActiveChange = () => {
        setCategoryCountriesActive(!categoryCountriesActive);
    };
    const handleCategoryMunicipalityActive = () => {
        setCategoryMunicipalityActive(!categoryMunicipalityActive);
    };
    const handleCategoryRiversActiveChange = () => {
        setCategoryRiversActive(!categoryRiversActive);
    };
    const handleCategoryCitiesActiveChange = () => {
        setCategoryCitiesActive(!categoryCitiesActive);
    };

    lobby = useGlobalState("lobby")

    setLobby = (l1) => {
        setGlobalState("lobby", l1)
    }

    const history = useHistory();


    const saveLobby = async () => {
        try {
            const requestBody = JSON.stringify({
                "rounds": rounds,
                "roundDuration": roundDuration,
                "host": host,
                "categoryCountriesActive": categoryCountriesActive,
                "categoryMunicipalityActive": categoryMunicipalityActive,
                "categoryCitiesActive": categoryCitiesActive,
                "categoryRiversActive": categoryRiversActive,
                "customCategory1": customCategory1,
                "customCategory2": customCategory2,
                "customCategory3": customCategory3
            });

            console.log(requestBody);

            const response = await api.post('/lobbies', requestBody);
            lobby = new Lobby(response.data)
            setLobby(lobby)
            localStorage.setItem("playerToken", lobby.hostToken)
            localStorage.setItem("hostToken", lobby.hostToken)
            localStorage.setItem("lobbyID", lobby.id)
            history.push('/lobby/' + lobby.id);
        } catch (error) {
            alert(`Something went wrong during lobby creation :(` + error.toString());
        }
    };

    return (
        <div>
            <div className="setup title">
                <h1>Game Setup</h1>
            </div>
            <div className="setup row">
                <div className="setup block-left">
                    <div>
                        Rounds
                        <RangeSlider
                            value={rounds}
                            min={2}
                            max={26}
                            variant='success'
                            tooltip='on'
                            onChange={changeEvent => setRounds(changeEvent.target.value)}
                        />
                    </div>
                    <p></p>
                    {/*<div>
                        Round Time
                        <RangeSlider
                            value={roundDuration}
                            min={1}
                            max={100}
                            variant='success'
                            onChange={changeEvent => setRoundDuration(changeEvent.target.value)}
                        />
                    </div>*/}
                    <p></p>
                    <div>
                        Username
                        <div className="setup form">
                            <FormField
                                onChange={un => setHost(un)}
                            />
                        </div>
                    </div>
                </div>
                <div className="setup block-right">
                    <Checkbox
                        label="City"
                        id='cityCheckbox'
                        onChange={handleCategoryCitiesActiveChange}
                    />
                    <p></p>
                    <Checkbox
                        label="Country"
                        id="countryCheckbox"
                        onChange={handleCategoryCountriesActiveChange}

                    />
                    <p></p>
                    <Checkbox
                        label="River"
                        id="riverCheckbox"
                        onChange={handleCategoryRiversActiveChange}

                    />
                    <p></p>
                    <Checkbox
                        label="Municipality"
                        id="municipalityCheckbox"
                        onChange={handleCategoryMunicipalityActive}
                    />
                    <div className="setup form">
                        <CategoryField
                            value=''
                            onChange={un => setCustomCategory1(un)}
                        />
                    </div>
                    <div className="setup form">
                        <CategoryField
                            value=''
                            onChange={un => setCustomCategory2(un)}
                        />
                    </div>
                    <div className="setup form">
                        <CategoryField
                            value=''
                            onChange={un => setCustomCategory3(un)}
                        />
                    </div>
                </div>
            </div>
            <div className="setup button">
                <Button
                    disabled={
                        !host || !(
                            categoryRiversActive || categoryCitiesActive || categoryCountriesActive || categoryMunicipalityActive
                        )
                    }
                    width="300%"
                    onClick={() => saveLobby()}
                >
                    Create Lobby
                </Button>
            </div>
        </div>
    )
}
export default Setup;