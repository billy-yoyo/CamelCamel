import * as React from 'react';
import Button from '../button';
import Panel from './panel';
import './gameControls.less';
import * as networkService from '../../service/networkService';
import { Hub } from '../../util/hub';

interface GameControlsProps {
    hub: Hub;
}

export default ({ hub }: GameControlsProps): JSX.Element => {

    const startGame = async () => {
        await networkService.startGame(hub.game.id);
        await hub.refreshGame();
    };
    const endGame = () => {
        alert('ending game not supported yet');
    };

    return (
        <Panel title={`Game: ${hub.game.id}`} className="game">
            <div className="buttons">
                {
                    hub.game.state.mode === 'creating'
                        ? <Button title="Start Game" onclick={startGame}/>
                        : <Button title="End Game" onclick={endGame}/>
                }
            </div>
        </Panel>
    )
};