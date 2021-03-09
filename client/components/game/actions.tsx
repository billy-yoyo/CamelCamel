import * as React from 'react';
import { ActionType } from '../../../common/model/game/actionType';
import { GameTile } from '../../../common/model/game/gameTile';
import { Hub } from '../../util/hub';
import { GameQuery, GameQueryBuilder } from '../../util/query';
import ActionButton from './actionButton';
import UndoButton from './undoButton';
import './actions.less';

interface ActionsProps {
    hub: Hub;
    tile: GameTile;
    pos: { x: number, y: number }
    queryBuilder: GameQueryBuilder;
}

export default ({ hub, tile, pos, queryBuilder }: ActionsProps): JSX.Element => {
    const [processing, setProcessing] = React.useState<ActionType>();
    const actions: ActionType[] = ['place', 'pickup', 'move', 'steal', 'transport'];

    return (
        <div className="actions">
            {
                actions.map((action, i) => (
                    <ActionButton
                      hub={hub}
                      pos={pos}
                      tile={tile}
                      action={action}
                      processing={processing}
                      setProcessing={setProcessing}
                      queryBuilder={queryBuilder}
                      key={i} />
                ))
            }
            <UndoButton hub={hub} setProcessing={setProcessing}/>
        </div>
    )
};