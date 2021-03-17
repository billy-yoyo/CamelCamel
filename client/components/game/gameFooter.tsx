import * as React from 'react';
import './gameFooter.less';
import Actions from './actions';
import { Hub } from '../../util/hub';
import { GameQueryBuilder } from '../../util/query';
import { ActionType } from '../../../common/model/game/actionType';
import UndoButton from './undoButton';
import Button from '../button';
import { endTurn } from '../../service/networkService';

interface GameFooterProps {
    hub: Hub;
    selected: {x: number, y: number};
    queryBuilder: GameQueryBuilder;
}

export default ({ hub, selected, queryBuilder }: GameFooterProps): JSX.Element => {
    const [processing, setProcessing] = React.useState<ActionType>();

    const selectedTile = selected && hub.game.state.tiles[selected.y] && hub.game.state.tiles[selected.y][selected.x];
    const turn = hub.game.state.turn;
    const isMyTurn = turn !== undefined && turn.playerId === hub.player.id;

    const endMyTurn = async () => {
        await endTurn(hub.game.id, hub.player.id);
        await hub.refreshGame();
    };

    return (
        <div className="game-footer">
            { isMyTurn &&
                <div className="remaining-actions-bar">
                    <div className="remaining-actions-title">
                        Actions
                    </div>
                    <div className="remaining-actions">
                        {
                            new Array(turn.remainingActions).fill(0).map( (_, i) => (
                                <div className='remaining-action' key={`remaining-action-${i}`} />
                            ))
                        }
                    </div>
                    <UndoButton hub={hub} setProcessing={setProcessing}/>
                    <Button title="End Turn" onclick={endMyTurn} className="end-turn-button"/>
                </div>
            }
            <Actions hub={hub} tile={selectedTile} pos={selected} queryBuilder={queryBuilder} processing={processing} setProcessing={setProcessing}></Actions>
        </div>
    )
};
