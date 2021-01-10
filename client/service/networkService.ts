import { Template } from "tsplate";
import { Action, TAction } from "../../common/model/game/action";
import { Game, TGame } from "../../common/model/game/game";
import { Player, TPlayer } from "../../common/model/game/player";
import { Success, TSuccess } from "../../common/model/response/success";
import { RemainingActions, TRemainingActions } from "../../common/model/response/remainingActions";
import { Update, TUpdate } from "../../common/model/response/update";

interface RequestOptions {
    method: 'get' | 'post';
    path: string;
    data?: any;
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

            if (data && this.status >= 200 && this.status < 300) {
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

export async function createGame(): Promise<Response<Game>> {
    return await performRequestWithModel({
        method: 'post',
        path: '/game',
        template: TGame
    });
}

export async function joinGame(gameId: string, player: Player): Promise<Response<Success>> {
    return await performRequestWithModel({
        method: 'post',
        path: `/game/${gameId}/join`,
        data: TPlayer.toTransit(player),
        template: TSuccess
    });
}

export async function startGame(gameId: string): Promise<Response<Success>> {
    return await performRequestWithModel({
        method: 'post',
        path: `/game/${gameId}/start`,
        template: TSuccess
    }); 
}

export async function performAction(gameId: string, playerId: string, action: Action): Promise<Response<RemainingActions>> {
    return await performRequestWithModel({
        method: 'post',
        path: `/game/${gameId}/action/${playerId}`,
        data: TAction.toTransit(action),
        template: TRemainingActions
    }); 
}

export async function shouldUpdate(gameId: string): Promise<Response<Update>> {
    return await performRequestWithModel({
        method: 'get',
        path: `/game/${gameId}/updated`,
        template: TUpdate
    });
}
