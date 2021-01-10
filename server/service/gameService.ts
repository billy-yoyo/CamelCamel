import { Game } from "../../common/model/game/game";
import gameRepo from '../repo/gameRepo';
import { randomId } from '../../common/util';
import { GameState } from "../../common/model/game/gameState";
import { Resource } from "../../common/model/game/resource";
import { GameTile } from "../../common/model/game/gameTile";
import { Player } from "../../common/model/game/player";
import { Turn } from "../../common/model/game/turn";
import { Action } from "../../common/model/game/action";
import actionService from "./actionService";

const GAME_ID_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// games will die after a day of inactivity
const GAME_LIFETIME = 86400000;

function deliver(deliver: Resource) {
    return new GameTile([], undefined, deliver, 0);
}

function money() {
    return new GameTile([], undefined, undefined, 1);
}

function tile() {
    return new GameTile([], undefined, undefined, 0);
}


export class GameService {
    async getGame(id: string): Promise<Game> {
        const game = await gameRepo.get(id);

        if (game && new Date().getTime() > game.lifetime) {
            gameRepo.set(id, undefined);
            return undefined;
        }

        return game;
    }

    async gameExists(id: string): Promise<boolean> {
        const game = await this.getGame(id);
        return !!game;
    }

    async createGame(): Promise<Game> {
        const id = await randomId(
            GAME_ID_ALPHABET,
            4,
            async (id) => !(await this.gameExists(id))
        );

        const game = new Game(
            id,
            new GameState('creating', undefined, [
                [money(),          tile(), tile(),           deliver('grey'),  tile(),          tile(), money()],
                [tile(),           tile(), tile(),           tile(),           tile(),          tile(), tile()],
                [tile(),           tile(), tile(),           deliver('red'),   tile(),          tile(), tile()],
                [deliver('green'), tile(), deliver('white'), tile(),           deliver('blue'), tile(), deliver('purple')],
                [tile(),           tile(), tile(),           deliver('brown'), tile(),          tile(), tile()],
                [tile(),           tile(), tile(),           tile(),           tile(),          tile(), tile()],
                [money(),          tile(), tile(),           deliver('pink'),  tile(),          tile(), money()],
            ], []),
            new Date().getTime() + GAME_LIFETIME,
            [],
            0
        );

        await gameRepo.set(id, game);
        return game;
    }

    async joinGame(game: Game, player: Player): Promise<boolean> {
        if (game.state.mode !== 'creating') {
            return false;
        }

        // player has already joined game, so we can return true
        if (game.players.some(
            otherPlayer => otherPlayer.id === player.id && otherPlayer.colour === player.colour
        )) {
            return true;
        }

        if (game.players.some(
            otherPlayer => otherPlayer.id === player.id || otherPlayer.colour === player.colour
        )) {
            return false;
        }

        if (game.players.length >= 4) {
            return false;
        }

        game.players.push(player);
        game.version++;
        await gameRepo.set(game.id, game);
        return true;
    }

    async startGame(game: Game): Promise<boolean> {
        if (game.state.mode === 'creating') {
            if (game.players.length === 0) {
                return false;
            }

            game.state.mode = 'playing';
            game.state.turn = new Turn(
                game.players[0].id,
                4,
                []
            );

            game.version++;
            await gameRepo.set(game.id, game);
            return true;
        } else if (game.state.mode === 'playing') {
            return true;
        } else if (game.state.mode === 'finished') {
            return false;
        }
    }

    async playAction(game: Game, player: Player, action: Action): Promise<number | string> {
        if (game.state.mode !== 'playing') {
            return 'Game is not in progress';
        }

        if (game.state.turn.playerId !== player.id) {
            return 'It is not your turn';
        }

        const result = actionService.performAction(game, player, action);

        if (result.message) {
            return result.message;
        }

        if (game.state.turn.remainingActions < result.cost) {
            return 'You don\'t have enough actions left to perform that action';
        }

        game.state.turn.remainingActions -= result.cost;
        game.state.turn.actions.push(action);
        result.executor();

        game.version++;
        await gameRepo.set(game.id, game);
        return game.state.turn.remainingActions;
    }
}

const gameService = new GameService();
export default gameService;
