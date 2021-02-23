import * as React from 'react';
import { Hub } from '../../util/hub';
import { GameQuery } from '../../util/query';
import Button from '../button';
import CamelPiece from '../../images/camelPiece';
import Triangle from '../../images/triangle';
import { endTurn } from '../../service/networkService';
import './gameHeader.less';
import { Player } from '../../../common/model/game/player';

interface GameHeaderProps {
    hub: Hub;
    query: GameQuery<any>;
}

export default ({ hub, query }: GameHeaderProps): JSX.Element => {
    if (hub.game.state.mode === 'finished') {
        let winners: Player[] = [];
        let winnerScore = 0;

        hub.game.players.forEach(p => {
            const score = p.calculateScore(hub.game.state);
            if (score > winnerScore) {
                winnerScore = score;
                winners = [p];
            } else if (score === winnerScore) {
                winners.push(p);
            }
        });

        return (
            <div className="game-header">
                <div className="game-header-row">
                    Game finished!
                    {
                        winners.length <= 0 
                            ? 'There were no winners!'
                            : (winners.length == 1
                                ? `${winners[0].id} was the winner with a score of ${winnerScore}!`
                                : `${winners.join(', ')} were all the winners, each with a score of ${winnerScore}!`
                            )
                    }
                </div>
            </div>
        )
    }

    if (hub.game?.state?.mode !== 'playing') {
        return (
            <div className="game-header">
                <div className="game-header-row">
                    <div className="tab query">
                        Waiting for game to start...
                    </div>
                </div>
            </div>
        )
    }

    const turn = hub.game.state.turn.playerId;
    const isMyTurn = turn !== undefined && turn === hub.player.id;
    const placedCamels = hub.game.state.countTiles(
        t => t.camels.filter(c => c.colour === hub.player.colour).length
    );

    const stealTokens = hub.game.state.stealTokens[hub.player.id];

    const endMyTurn = async () => {
        await endTurn(hub.game.id, hub.player.id);
        await hub.refreshGame();
    };

    return (
        <div className="game-header">
            <div className="game-header-row">
                <div className="tab turn-name">
                    {
                        query ? query.name : ( isMyTurn ? `It's your turn!` : `It's ${turn}'s turn` )
                    }
                </div>
            </div>
            <div className="game-header-row">
                <div className="tab remaining-steal-tokens">
                    Steals
                    <div className="remaining-steal-token-list">
                        { stealTokens > 0
                            ?   new Array(stealTokens).fill(0).map((_, i) => (
                                    <div className="remaining-steal-token" key={`remaining-steal-token-${i}`}>
                                        <Triangle fill='yellow' stroke='black' strokeWidth='10'/>
                                    </div>
                                ))
                            :   'None'
                        }
                    </div>
                </div>
                { placedCamels < hub.game.camelLimit &&
                    <div className="tab remaining-camels">
                        Camels
                        <div className="remaining-camel-list">
                            {
                                new Array(hub.game.camelLimit - placedCamels).fill(0).map((_, i) => (
                                    <div className="remaining-camel-piece" key={`remaining-camel-${i}`}>
                                        <CamelPiece fill={hub.player.colour} stroke="black" />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                }
                { isMyTurn &&
                <div className="tab remaining-actions">
                    Actions
                    <div className="remaining-action-list">
                        {
                            new Array(hub.game.state.turn.remainingActions).fill(0).map( (_, i) => (
                                <div className="remaining-action" key={`remaining-action-${i}`} />
                            ))
                        }
                    </div>
                </div>
                }
                { isMyTurn &&
                    <Button title="End Turn" onclick={endMyTurn}/>
                }
            </div>
        </div>
    )
};