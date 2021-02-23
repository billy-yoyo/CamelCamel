import * as React from 'react';
import { Action, MoveData, PickupData, PlaceData, StealData, TransportData } from '../../../common/model/game/action';
import { ActionType } from '../../../common/model/game/actionType';
import { Game } from '../../../common/model/game/game';
import { GameTile } from '../../../common/model/game/gameTile';
import { Player } from '../../../common/model/game/player';
import * as networkService from '../../service/networkService';
import { Hub } from '../../util/hub';
import { GameQueryBuilder } from '../../util/query';
import './actionButton.less';

interface ActionStateProps {
    player: Player;
    game: Game;
    tile: GameTile;
    pos: { x: number, y: number };
    queryBuilder: GameQueryBuilder;
}

interface ActionButtonProps {
    hub: Hub;
    pos: { x: number, y: number };
    tile: GameTile;
    action: ActionType;
    processing: ActionType;
    setProcessing: (processing: ActionType) => void;
    queryBuilder: GameQueryBuilder;
}

const hasRemainingCamel = ({ player, game }: ActionStateProps) => (
    game.state.countTiles(
        t => t.camels.filter(c => c.colour === player.colour).length
    ) < game.camelLimit
);

const hasFreeCamel = ({ player, tile } : ActionStateProps) => (
    tile.camels.some(camel => camel.colour === player.colour && camel.carrying === undefined)
);

const hasCarryingCamel = ({ player, tile }: ActionStateProps) => (
    tile.camels.some(camel => camel.colour === player.colour && camel.carrying !== undefined)
);

const hasStealableCamel = ({ player, tile }: ActionStateProps) => (
    tile.camels.some(camel => camel.colour !== player.colour && camel.carrying !== undefined && !camel.isResourceSafe)
)

const hasStealToken = ({ player, game }: ActionStateProps) => (
    game.state.stealTokens[player.id] > 0
)

const ACTION_VALIDATORS: {[k in ActionType]: ({ player, game, tile }: ActionStateProps) => boolean} = {
    place: (state) => hasRemainingCamel(state),
    transport: (state) => hasCarryingCamel(state),
    move: (state) => hasFreeCamel(state),
    pickup: (state) => hasFreeCamel(state) && state.tile.resource !== undefined,
    steal: (state) => hasFreeCamel(state) && hasStealableCamel(state) && hasStealToken(state)
};

const ACTION_TITLES: {[k in ActionType]: string} = {
    place: 'Place',
    transport: 'Transport',
    move: 'Move',
    pickup: 'Pickup',
    steal: 'Steal'
};

const actionData = async (state: ActionStateProps, action: ActionType): Promise<Action> => {
    if (action === 'place') {
        const data: PlaceData = { tile: state.pos }
        return new Action(action, data);
    } else if (action === 'transport') {
        const camel = await state.queryBuilder.selectCamel(
            state.tile,
            c => c.colour === state.player.colour && c.carrying !== undefined
        );
        const tile = await state.queryBuilder.selectTile();
        const data: TransportData = { from: state.pos, to: tile, resource: camel.resource };
        return new Action(action, data);
    } else if (action === 'move') {
        const tile = await state.queryBuilder.selectTile();
        const data: MoveData = { from: state.pos, to: tile };
        return new Action(action, data);
    } else if (action === 'pickup') {
        const data: PickupData = { tile: state.pos }
        return new Action(action, data);
    } else if (action === 'steal') {
        const camel = await state.queryBuilder.selectCamel(
            state.tile,
            c => c.colour !== state.player.colour && c.carrying !== undefined && !c.isResourceSafe
        );
        const data: StealData = { tile: state.pos, targetColour: camel.colour, targetResource: camel.resource };
        return new Action(action, data);
    }
};

const handleAction = async (state: ActionStateProps, actionType: ActionType, setGame: (game: Game) => void) => {
    const action = await actionData(state, actionType);

    const response = await networkService.performAction(state.game.id, state.player.id, action);
    if (response.error) {
        // todo: somehow handle error?
    }
    // todo: keep track of remaining actions

    const game = await networkService.getGame(state.game.id);
    if (game.error) {
        // todo: somehow handle error?
    }

    setGame(game.data);
};

const actionValid = (state: ActionStateProps, action: ActionType): boolean => {
    if (!state.tile || state.game.state.mode !== 'playing' || state.game.state.turn.playerId !== state.player.id) {
        return false;
    }

    const validator = ACTION_VALIDATORS[action];
    return validator ? validator(state) : false;
};

export default ({ hub, pos, tile, action, processing, setProcessing, queryBuilder } : ActionButtonProps): JSX.Element => {
    const game = hub.game;
    const player = hub.player;

    const state: ActionStateProps = { player, game, tile, pos, queryBuilder };

    const classes = ['action-button', 'button', 'primary'];
    if (!actionValid(state, action)) {
        classes.push('disabled');
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
            handleAction(state, action, hub.setGame).then(() => setProcessing(undefined));
        }
    };

    return (
        <div className={actionClass} onClick={onClick}>
            {ACTION_TITLES[action]}
        </div>
    )
};