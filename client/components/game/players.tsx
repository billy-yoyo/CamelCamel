import * as React from 'react';
import { Game } from '../../../common/model/game/game';
import PlayerCard from './player';
import Panel from './panel';
import './players.less';

interface PlayersProps {
    game: Game;
}

export default ({ game }: PlayersProps): JSX.Element => {
    return (
        <Panel title="Players" className="players">
            <div className="list">
                {
                    game.players.map(player => (
                        <PlayerCard player={player}
                                    game={game}
                                    isTurn={game?.state?.turn?.playerId === player.id}
                                    key={player.id}/>
                    ))
                }
            </div>
        </Panel>
    )
};