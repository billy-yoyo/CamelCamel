import * as React from 'react';
import { ActionType } from '../../../common/model/game/actionType';
import { GameTile } from '../../../common/model/game/gameTile';
import { Hub } from '../../util/hub';
import { GameQueryBuilder } from '../../util/query';
import ActionButton from './actionButton';
import './actions.less';

interface ActionsProps {
    hub: Hub;
    tile: GameTile;
    pos: { x: number, y: number }
    queryBuilder: GameQueryBuilder;
    processing: ActionType;
    setProcessing: (value: ActionType) => void;
}

export default ({ hub, tile, pos, queryBuilder, processing, setProcessing }: ActionsProps): JSX.Element => {
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
        </div>
    )
};