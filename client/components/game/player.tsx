import * as React from 'react';
import { Game } from '../../../common/model/game/game';
import { Player } from '../../../common/model/game/player';
import "./player.less";

interface PlayerProps {
    player: Player;
    game: Game;
    isTurn: boolean;
}

export default ({ player, game, isTurn }: PlayerProps): JSX.Element => {
    return (
        <div className={'player' + (isTurn ? ' turn' : '')}>
            <div className="colour" style={{backgroundColor: player.colour}} />
            <div className="name">
                {player.id}
            </div>
            <div className="score">
                {player.calculateScore(game.state)}
            </div>
        </div>
    )
};