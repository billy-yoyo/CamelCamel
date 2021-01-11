import * as React from 'react';
import { ActionType } from '../../../common/model/game/actionType';
import { GameTile } from '../../../common/model/game/gameTile';
import ActionButton from './actionButton';
import './actions.less';

interface ActionsProps {
    tile: GameTile;
}

export default ({ tile }: ActionsProps): JSX.Element => {
    const [processing, setProcessing] = React.useState<ActionType>();
    const actions: ActionType[] = ['place', 'move', 'pickup', 'steal', 'transport'];

    return (
        <div className="actions">
            {
                actions.map(action => (
                    <ActionButton tile={tile} action={action} processing={processing} setProcessing={setProcessing}></ActionButton>
                ))
            }
        </div>
    )
};