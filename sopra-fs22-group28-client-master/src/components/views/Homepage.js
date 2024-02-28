import React from 'react';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import {InfoButton} from 'components/ui/Button';
import 'styles/views/Homepage.scss';


const Homepage = props => {

    const history = useHistory();
    // avoid weird stuff happening when playing again / testing multiple lobbies
    localStorage.clear();

    const toGameSetup = () => {
        history.push('/setup');
    };

    const toInfo = () => {
        history.push('/info');
    };

    return (
        <div>
            <div className="homepage title">
                <h1>Welcome to Categories!</h1>
            </div>
            <div className="homepage button-container">
                <Button
                    width="300%"
                    onClick={() => toGameSetup()}
                >
                    Create Game
                </Button>
            </div>
            <div className="homepage info-container">
                <InfoButton
                    onClick={() => toInfo()}>
                    Info
                </InfoButton>
            </div>
        </div>
    )
}
export default Homepage;
