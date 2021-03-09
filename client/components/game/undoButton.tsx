import * as React from 'react';
import { Hub } from '../../util/hub';
import { undoAction } from '../../service/networkService';
import { ActionType } from '../../../common/model/game/actionType';
import UndoIcon from '../../images/undoIcon';

interface UndoButtonProps {
    hub: Hub;
    setProcessing: (processing: ActionType) => void;
}

export default ({ hub, setProcessing }: UndoButtonProps): JSX.Element => {
    const undo = () => {
        setProcessing(null);
        undoAction(hub.game.id, hub.player.id)
            .then(() => {
                hub.refreshGame();
                setProcessing(undefined)
            })
            .catch(() => setProcessing(undefined));
    };

    return (
        <div className="undo-button button primary" onClick={undo}>
            <UndoIcon width="30px" height="30px" fill="white"/>
        </div>
    )
};