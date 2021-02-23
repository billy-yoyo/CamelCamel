import { Game } from "../../common/model/game/game";
import gameRepo from '../repo/gameRepo';
import { GameState } from "../../common/model/game/gameState";
import { Resource } from "../../common/model/game/resource";
import { GameTile } from "../../common/model/game/gameTile";
import { Player } from "../../common/model/game/player";
import { Turn } from "../../common/model/game/turn";
import { Action } from "../../common/model/game/action";
import actionService from "./actionService";

// games will die after a day of inactivity
const GAME_LIFETIME = 86400000;
const GAME_CAMEL_LIMIT = 5;

function deliver(resource: Resource) {
    return new GameTile([], undefined, resource, 0, 0);
}

function money(c: number) {
    return new GameTile([], undefined, undefined, c, 1);
}

function spawn(c: number) {
    return new GameTile([], undefined, undefined, c, 0);
}

function tile() {
    return new GameTile([], undefined, undefined, 0, 0);
}


export class GameService {
    async getGame(id: string): Promise<Game> {
        const game = await gameRepo.get(id);

        if (game && new Date().getTime() > game.lifetime) {
            console.warn(`game is too old, considering as dead.`)
            await gameRepo.set(id, undefined);
            return undefined;
        }

        if (!game) {
            console.warn('fetched undefined game.');
        }

        return game;
    }

    async gameExists(id: string): Promise<boolean> {
        const game = await this.getGame(id);
        return !!game;
    }

    async createGame(gameId: string): Promise<Game> {
        if (await this.gameExists(gameId)) {
            return null;
        }

        let c = 1;
        const game = new Game(
            gameId,
            GAME_CAMEL_LIMIT,
            new GameState('creating', undefined, [
                [money(c++),       tile(),     tile(),           deliver('grey'),  tile(),          tile(),     money(c++)],
                [tile(),           spawn(c++), tile(),           tile(),           tile(),          spawn(c++), tile()],
                [tile(),           tile(),     tile(),           deliver('red'),   tile(),          tile(),     tile()],
                [deliver('green'), tile(),     deliver('white'), tile(),           deliver('blue'), tile(),     deliver('purple')],
                [tile(),           tile(),     tile(),           deliver('brown'), tile(),          tile(),     tile()],
                [tile(),           spawn(c++), tile(),           tile(),           tile(),          spawn(c++), tile()],
                [money(c++),       tile(),     tile(),           deliver('pink'),  tile(),          tile(),     money(c++)],
            ], [], {
                'green': 0, 'red': 0, 'blue': 0, 'brown': 0,
                'grey': 0, 'pink': 0, 'purple': 0, 'white': 0
            }, false, {}),
            new Date().getTime() + GAME_LIFETIME,
            [],
            0
        );

        await gameRepo.set(gameId, game);
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
            if (game.players.length <= 1) {
                return false;
            }

            // initialize bag
            let expensiveGoods = 3;
            let cheapGoods = 9;

            if (game.players.length <= 3) {
                expensiveGoods -= 1;
                cheapGoods -= 3;
            }

            game.state.bag = {
                red: cheapGoods,
                blue: cheapGoods,
                white: cheapGoods,
                brown: cheapGoods,
                grey: expensiveGoods,
                purple: expensiveGoods,
                green: expensiveGoods,
                pink: expensiveGoods
            };

            game.players.forEach(p => game.state.stealTokens[p.id] = 1);

            game.state.mode = 'playing';
            game.state.turn = new Turn(
                game.players[0].id,
                4,
                []
            );

            game.version++;
            await gameRepo.set(game.id, game);
            await this.checkGameState(game);
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
        if (result.executor()) {
            await this.endGame(game);
        }

        game.version++;
        await gameRepo.set(game.id, game);

        await this.checkGameState(game);
        return game.state.turn.remainingActions;
    }

    async endTurn(game: Game, player: Player): Promise<string> {
        if (game.state.mode !== 'playing' || !game.state.turn) {
            return `Game is not in progress`;
        }

        if (game.state.turn.playerId !== player.id) {
            return `It's not ${player.id}'s turn`;
        }

        const index = game.players.findIndex(p => p.id === player.id);

        if (index < 0) {
            return `Player ${player.id} doesn't seem to exist`;
        }

        const nextIndex = index + 1 >= game.players.length ? 0 : index + 1;

        game.state.turn = new Turn(game.players[nextIndex].id, 4, []);

        game.version++;
        await gameRepo.set(game.id, game);
        return undefined;
    }

    async checkGameState(game: Game): Promise<void> {
        if (game.state.mode !== 'playing') {
            return;
        }

        // count the number of resources sitting on spawns
        const resourcesOnMap = game.state.countTiles(
            t => (t.spawnId > 0 && t.resource !== undefined) ? 1 : 0
        );

        if (resourcesOnMap <= 4) {
            // first add money to all existing resource tiles on spawns
            game.state.tiles.forEach(row => {
                row.forEach(t => {
                    if (t.spawnId > 0 && t.resource !== undefined) {
                        t.money += 1;
                    }
                });
            });

            let cubes = Object.values(game.state.bag).reduce((total, x) => total + x, 0);
            const pickCube = () => {
                if (cubes <= 0) {
                    return undefined;
                }

                const rng = Math.floor(Math.random() * cubes);
                let total = 0;
                const [resource, remaining] = Object.entries(game.state.bag).find(([_, rem]) => {
                    if (rng < total + rem) {
                        return true;
                    } else {
                        total += rem;
                    }
                });
                cubes -= 1;
                game.state.bag[resource as Resource] = remaining - 1;
                return resource as Resource;
            };

            // now add resources to all spawn points missing a resource
            game.state.tiles.forEach(row => {
                row.forEach(t => {
                    if (t.spawnId > 0 && t.resource === undefined) {
                        t.resource = pickCube();
                    }
                });
            });

            if (cubes <= 0) {
                game.state.finalTurn = true;
            }

            game.version++;
            await gameRepo.set(game.id, game);
        }
    }

    async endGame(game: Game): Promise<void> {
        game.state.mode = 'finished';
    }
}

const gameService = new GameService();
export default gameService;
