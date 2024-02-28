import React from 'react';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Info.scss';


const Info = props => {

  const history = useHistory();

  const toHomepage = () => {
    history.push('/homepage');
  };

  return (
    <div>
          <div className="info block">
              <h1>Instructions</h1>
              <b>1. Create Game</b><br/>
              <b>2.Game Setup</b><br/>
              Select how many rounds should be played,
              how long a round should take at most
              and choose the categories you want to play with.<br/><br/>
              <b>3. Lobby</b><br/>
              In order to play with your friends, copy the link and send it to your friends.<br/><br/>
              <b>4. Game</b><br/>
              The Round starts and a random letter appears, fill in all the fields and press on finished to end the round.<br/><br/>
              <b>5. Results</b><br/>
              After every round the solutions of all players are shown and points are given. 2 points for every unique answer and 1 otherwise. Should a word be wrong, the players can decide by clicking on vote if a word should be correct or not.<br/><br/>
              If you want to know more about a word, just click on it.<br/>
              <h2>Detailed Category Information</h2><br/>
              <b>Cities:</b><br/>
              All populated places are accepted - even very small villages with just a few inhabitants.<br/>
              <b>Countries:</b><br/>
              Only actual countries count - for example "Wales" will therefore not be accepted. "Slang"-terms like "Weissrussland" for Belarus are ok.<br/><br/>
              <b>Rivers:</b><br/>
              Nothing special here - only the general limitation (wikipedia required) applies.<br/><br/>
              <b>Municipalities:</b><br/>
              Only Swiss Municipalities ("Gemeinden") are allowed here. <br/><br/>
              In general, most answers are valid even in different languages. For example, "geneve", "genf" and "geneva" will all be just fine.<br/><br/>
              <b>Please note that in order to avoid "false positives" such as "Haus" or "Garten" being valid villages, all answers need to have a wikipedia article in their name in order to count.</b><br/>
              <b>Have Fun!</b><br/>
          </div>
        <div className="info button">
            <Button
            onClick={() => toHomepage()}>
                Back
            </Button>
        </div>
    </div>
  )
}
export default Info;