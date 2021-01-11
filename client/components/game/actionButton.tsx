import * as React from 'react';
import { Action } from '../../../common/model/game/action';
import { ActionType } from '../../../common/model/game/actionType';
import { GameTile } from '../../../common/model/game/gameTile';
import * as networkService from '../../service/networkService';
import './actionButton.less';

interface ActionButtonProps {
    tile: GameTile;
    action: ActionType;
    processing: ActionType;
    setProcessing: (processing: ActionType) => void;
}

const ACTION_VALIDATORS: {[k in ActionType]: (tile: GameTile) => boolean} = {
    place: (tile) => false,
    transport: (tile) => false,
    move: (tile) => false,
    pickup: (tile) => false,
    steal: (tile) => false
};

const ACTION_TITLES: {[k in ActionType]: string} = {
    place: 'Place',
    transport: 'Transport',
    move: 'Move',
    pickup: 'Pickup',
    steal: 'Steal'
};

const actionData = async (tile: GameTile, action: ActionType): Promise<Action> => {
    return undefined;
};

const handleAction = async (tile: GameTile, action: ActionType) => {
    const data = await actionData(tile, action);
    // TODO: await networkService.performAction()
};

const actionValid = (tile: GameTile, action: ActionType): boolean => {
    const validator = ACTION_VALIDATORS[action];
    return validator ? validator(tile) : false;
};

export default ({ tile, action, processing, setProcessing } : ActionButtonProps): JSX.Element => {
    const classes = ['button', 'action-button'];
    if (actionValid(tile, action)) {
        classes.push('valid');
    }
    if (processing !== undefined) {
        if (action === processing) {
            classes.push('processing');
        } else {
            classes.push('not-processing');
        }
    }
    const actionClass = classes.join(' ');

    const onClick = () => {
        if (processing === undefined) {
            setProcessing(action);
            handleAction(tile, action).then(() => setProcessing(undefined));
        }
    };

    return (
        <div className={actionClass}>
            {ACTION_TITLES[action]}
        </div>
    )
};