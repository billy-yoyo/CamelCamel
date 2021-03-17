import * as React from 'react';
import { Hub } from '../../util/hub';
import { undoAction } from '../../service/networkService';
import { ActionType } from '../../../common/model/game/actionType';
import UndoIcon from '../../images/undoIcon';
import './undoButton.less';
import { isPortrait } from '../../util/mediaQuery';

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

    const size = isPortrait() ? '17px' : '29px';

    return (
        <div className="undo-button button primary" onClick={undo}>
            <UndoIcon width={size} height={size} fill="white"/>
        </div>
    )
};