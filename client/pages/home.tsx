import * as React from 'react';
import Button from '../components/button';
import Textbox from '../components/textbox';
import Camel from '../images/camel';
import "./home.less";

export default (): JSX.Element => {
    return (
        <div className="home">
            <Camel colour='#44b' width="300px"></Camel>
            <div className="game-name">
                <Textbox title="Game"></Textbox>
            </div>
            <div className="player-name">
                <Textbox title="Player"></Textbox>
            </div>
            <div className="create-game">
                <Button title="Create Game"></Button>
            </div>
            <div className="join-game">
                <Button title="Join Game"></Button>
            </div>
        </div>
    )
};