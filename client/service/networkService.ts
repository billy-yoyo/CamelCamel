import { Template } from "tsplate";
import { Action, TAction } from "../../common/model/game/action";
import { Game, TGame } from "../../common/model/game/game";
import { Player, TPlayer } from "../../common/model/game/player";
import { Success, TSuccess } from "../../common/model/response/success";
import { RemainingActions, TRemainingActions } from "../../common/model/response/remainingActions";
import { Update, TUpdate } from "../../common/model/response/update";
import { Messages, TMessages } from "../../common/model/response/messages";
import { Message, TMessage } from "../../common/model/game/message";
import { PlayerType } from "../../common/model/game/playerType";

type Signal = (aborter: () => void) => void;

interface RequestOptions {
    method: 'get' | 'post' | 'delete';
    path: string;
    data?: any;
    signal?: Signal;
}

interface ResponseError {
    status: number;
    statusText: string;
    message: string;
}

interface Response<T> {
    data?: T;
    error?: ResponseError;
}

function attemptJSON(data: string): any {
    try {
        return JSON.parse(data)
    } catch {
        return null;
    }
}

async function performRequest(opts: RequestOptions): Promise<any> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(opts.method, opts.path, true);
        xhr.onload = () => {
            const data = attemptJSON(xhr.responseText);

            if (data && xhr.status >= 200 && xhr.status < 300) {
                resolve(data)
            } else {
                reject({
                    status: xhr.status,
                    statusText: data && data.title ? data.title : xhr.statusText,
                    message: data && data.message
                });
            }
        };
        xhr.onerror = () => {
            const data = attemptJSON(xhr.responseText);

            reject({
                status: xhr.status,
                statusText: data && data.title ? data.title : xhr.statusText,
                message: data && data.message
            });
        };
        if (opts.data) {
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(opts.data))
        } else {
            xhr.send();
        }

        if (opts.signal) {
            opts.signal(() => xhr.abort());
        }
    });
}

export async function performRequestWithModel<T>(opts: RequestOptions & { template: Template<T, any> }): Promise<Response<T>> {
    try {
        const data = await performRequest(opts);
        if (opts.template.valid(data)) {
            return { data: opts.template.toModel(data) };
        } else {
            return { error: { status: 200, statusText: 'OK', message: 'Unrecognized response object' }};
        }
    } catch (error) {
        return { error };
    }
}

export async function getGame(gameId: string): Promise<Response<Game>> {
    return await performRequestWithModel({
        method: 'get',
        path: `/game/${gameId}`,
        template: TGame
    });
}

export async function createGame(gameId: string): Promise<Response<Game>> {
    return await performRequestWithModel({
        method: 'post',
        path: `/game/${gameId}`,
        template: TGame
    });
}

export async function joinGame(gameId: string, player: Player): Promise<Response<Game>> {
    return await performRequestWithModel({
        method: 'post',
        path: `/game/${gameId}/join`,
        data: TPlayer.toTransit(player),
        template: TGame
    });
}

export async function startGame(gameId: string): Promise<Response<Success>> {
    return await performRequestWithModel({
        method: 'post',
        path: `/game/${gameId}/start`,
        template: TSuccess
    });
}

export async function restartGame(gameId: string): Promise<Response<Success>> {
    return await performRequestWithModel({
        method: 'post',
        path: `/game/${gameId}/restart`,
        template: TSuccess
    });
}

export async function performAction(gameId: string, playerId: string, action: Action): Promise<Response<RemainingActions>> {
    return await performRequestWithModel({
        method: 'post',
        path: `/game/${gameId}/action?playerId=${encodeURIComponent(playerId)}`,
        data: TAction.toTransit(action),
        template: TRemainingActions
    });
}

export async function undoAction(gameId: string, playerId: string): Promise<Response<Success>> {
    return await performRequestWithModel({
        method: 'post',
        path: `/game/${gameId}/undo?playerId=${encodeURIComponent(playerId)}`,
        template: TSuccess
    });
}

export async function endTurn(gameId: string, playerId: string): Promise<Response<Success>> {
    return await performRequestWithModel({
        method: 'post',
        path: `/game/${gameId}/end?playerId=${encodeURIComponent(playerId)}`,
        template: TSuccess
    });
}

export async function shouldUpdate(gameId: string, gameVersion: number, signal?: Signal): Promise<Response<Update>> {
    return await performRequestWithModel({
        method: 'get',
        path: `/game/${gameId}/updated?version=${gameVersion}`,
        template: TUpdate,
        signal
    });
}

export async function newMessages(gameId: string, messageVersion: number, signal?: Signal): Promise<Response<Messages>> {
    return await performRequestWithModel({
        method: 'get',
        path: `/game/${gameId}/messages/new?version=${messageVersion}`,
        template: TMessages,
        signal
    });
}

export async function sendMessage(gameId: string, message: Message): Promise<Response<Success>> {
    return await performRequestWithModel({
        method: 'post',
        path: `/game/${gameId}/messages`,
        data: TMessage.toTransit(message),
        template: TSuccess
    });
}

export async function addAiPlayer(gameId: string): Promise<Response<Success>> {
    return await performRequestWithModel({
        method: 'post',
        path: `/game/${gameId}/ai`,
        template: TSuccess
    });
}

export async function kickAiPlayer(gameId: string, playerId: string): Promise<Response<Success>> {
    return await performRequestWithModel({
        method: 'delete',
        path: `/game/${gameId}/ai?playerId=${encodeURIComponent(playerId)}`,
        template: TSuccess
    });
}

export async function changeAiDifficulty(gameId: string, playerId: string, difficulty: PlayerType): Promise<Response<Success>> {
    return await performRequestWithModel({
        method: 'post',
        path: `/game/${gameId}/ai/difficulty?playerId=${encodeURIComponent(playerId)}&difficulty=${encodeURIComponent(difficulty)}`,
        template: TSuccess
    });
}
