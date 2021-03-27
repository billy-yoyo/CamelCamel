import * as React from 'react';
import { Game } from '../../../common/model/game/game';
import { Player } from '../../../common/model/game/player';
import "./player.less";
import { kickAiPlayer, changeAiDifficulty } from '../../service/networkService';

interface PlayerProps {
    player: Player;
    game: Game;
    isTurn: boolean;
}

export default ({ player, game, isTurn }: PlayerProps): JSX.Element => {
    const kickAi = async () => {
        if (!player.isHuman) {
            await kickAiPlayer(game.id, player.id);
        }
    };

    const changeDifficulty = async () => {
        if (player.type === 'easy-ai') {
            await changeAiDifficulty(game.id, player.id, 'medium-ai');
        } else if (player.type === 'medium-ai') {
            await changeAiDifficulty(game.id, player.id, 'hard-ai');
        } else if (player.type === 'hard-ai') {
            await changeAiDifficulty(game.id, player.id, 'easy-ai');
        }
    };

    return (
        <div className={'player' + (isTurn ? ' turn' : '')}>
            <div className="colour" style={{backgroundColor: player.colour}} />
            <div className="name">
                {player.id}
            </div>
            { game.state.mode !== 'creating' &&
                <div className="score">
                    {player.calculateScore(game.state)}
                </div>
            }
            { game.state.mode === 'creating' && !player.isHuman &&
                <div className="button primary player-button kick" onClick={kickAi}>
                    Kick
                </div>
            }
            { game.state.mode === 'creating' && !player.isHuman &&
                <div className="button primary player-button difficulty" onClick={changeDifficulty}>
                    { player.type === 'easy-ai' && 'Easy' }
                    { player.type === 'medium-ai' && 'Medium' }
                    { player.type === 'hard-ai' && 'Hard' }
                </div>
            }
        </div>
    )
};