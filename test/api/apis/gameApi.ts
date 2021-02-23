import expect from '../lib/apiExpect';
import { TGame } from '../../../common/model/game/game';
import { Player, TPlayer } from '../../../common/model/game/player';
import { TSuccess } from '../../../common/model/response/success';
import { TRemainingActions } from '../../../common/model/response/remainingActions';
import { TUpdate } from '../../../common/model/response/update';
import { Action, TAction } from '../../../common/model/game/action';

class GameAPI {
    getGame(gameId: string) {
        return expect({
            path: `/game/${gameId}`,
            method: 'get',
            responseTemplate: TGame
        });
    }

    createGame(gameId: string) {
        return expect({
            path: `/game/${gameId}`,
            method: 'post',
            responseTemplate: TGame
        });
    }

    joinGame(gameId: string, player: Player) {
        return expect({
            path: `/game/${gameId}/join`,
            method: 'post',
            responseTemplate: TGame,
            body: player,
            bodyTemplate: TPlayer
        });
    }

    startGame(gameId: string) {
        return expect({
            path: `/game/${gameId}/start`,
            method: 'post',
            responseTemplate: TSuccess
        });
    }

    doAction(gameId: string, playerId: string, action: Action) {
        return expect({
            path: `/game/${gameId}/action/${playerId}`,
            method: 'post',
            responseTemplate: TRemainingActions,
            body: action,
            bodyTemplate: TAction
        });
    }

    hasUpdated(gameId: string, version: number) {
        return expect({
            path: `/game/${gameId}/updated?version=${version}`,
            method: 'get',
            responseTemplate: TUpdate
        });
    }
}

export default new GameAPI();