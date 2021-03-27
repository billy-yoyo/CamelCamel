import * as React from 'react';
import Button from '../button';
import Panel from './panel';
import './gameControls.less';
import * as networkService from '../../service/networkService';
import { Hub } from '../../util/hub';

interface GameControlsProps {
    hub: Hub;
}

const GameInfo = ({ hub }: GameControlsProps): JSX.Element => {
    return <div className="game-info">
        <div className="game-info-row">
            <div className="game-info-name">
                Remaining Cubes
            </div>
            <div className="game-info-value">
                { Object.values(hub.game.state.bag).reduce((total, x) => total + x, 0) }
            </div>
        </div>
    </div>
};

export default ({ hub }: GameControlsProps): JSX.Element => {
    if (!hub.game) {
        return <div></div>
    }

    const startGame = async () => {
        await networkService.startGame(hub.game.id);
        await hub.refreshGame();
    };

    const restartGame = async () => {
        await networkService.restartGame(hub.game.id);
        await hub.refreshGame();
    };

    const addComputerPlayer = async () => {
        await networkService.addAiPlayer(hub.game.id);
        await hub.refreshGame();
    };

    return (
        <Panel title={`Game: ${hub.game.id}`} className="game">
            <div className="buttons">
                { hub.game.state.mode === 'creating' &&
                    <Button title="Start Game" onclick={startGame} />
                }
                { hub.game.state.mode === 'creating' &&
                    <Button title="Add Computer" onclick={addComputerPlayer} className="add-computer" />
                }
                { hub.game.state.mode === 'playing' &&
                    <GameInfo hub={hub}/>
                }
                { hub.game.state.mode === 'finished' &&
                    <Button title="Restart Game" onclick={restartGame} />
                }
            </div>
        </Panel>
    )
};