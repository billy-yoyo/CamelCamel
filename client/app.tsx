import * as React from 'react';
import ReactDOM from 'react-dom';
import Button from './components/button';
import Textbox from './components/textbox';
import "./app.less";

const App = (): JSX.Element => {

    return (
        <div className="app">
            <div className="game-name">
                <Textbox></Textbox>
            </div>
            <div className="player-name">
                <Textbox></Textbox>
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

ReactDOM.render(App(), document.getElementById('app'));