import { Game } from "../../common/model/game/game";
import gameRepo from '../repo/gameRepo';
import gameStateHistoryRepo from '../repo/gameStateHistoryRepo';
import { GameState } from "../../common/model/game/gameState";
import { Resource } from "../../common/model/game/resource";
import { GameTile } from "../../common/model/game/gameTile";
import { Player } from "../../common/model/game/player";
import { Turn } from "../../common/model/game/turn";
import { Action } from "../../common/model/game/action";
import actionService from "./actionService";
import messageService from './messageService';
import * as ai from '../ai';
import { PlayerColour } from "../../common/model/game/playerColour";
import { PlayerType } from "../../common/model/game/playerType";

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
    async deleteGame(id: string): Promise<void> {
        await gameRepo.set(id, undefined);
        await gameStateHistoryRepo.set(id, undefined);
        await messageService.deleteAllMessages(id);
    }

    async getGame(id: string): Promise<Game> {
        const game = await gameRepo.get(id);

        if (game && new Date().getTime() > game.lifetime) {
            console.warn(`game is too old, considering as dead.`);
            await this.deleteGame(game.id);
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

    createNewGameState(): GameState {
        let c = 1;

        return new GameState('creating', undefined, [
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
        }, false, {})
    }

    async createGame(gameId: string): Promise<Game> {
        if (await this.gameExists(gameId)) {
            return null;
        }

        const game = new Game(
            gameId,
            GAME_CAMEL_LIMIT,
            this.createNewGameState(),
            new Date().getTime() + GAME_LIFETIME,
            [],
            0
        );

        await gameRepo.set(gameId, game);
        return game;
    }

    async joinGame(game: Game, player: Player): Promise<string> {
        // player has already joined game, so we can return true even if the game has already started
        if (game.players.some(
            otherPlayer => otherPlayer.id === player.id && otherPlayer.colour === player.colour
        )) {
            return undefined;
        }

        // if the player isn't already in the game when it starts, then they can't join late
        if (game.state.mode !== 'creating') {
            return `Game ${game.id} is already in progress`;
        }

        if (game.players.some(
            otherPlayer => otherPlayer.id === player.id
        )) {
            return `A player with the same name is already in the game`;
        }

        if (game.players.some(
            otherPlayer => otherPlayer.colour === player.colour
        )) {
            return `A player with the same colour is already in the game`;
        }

        if (game.players.length >= 4) {
            return `The game is already full`;
        }

        game.players.push(player);
        game.version++;
        await gameRepo.set(game.id, game);
        return undefined;
    }

    async restartGame(gameId: string): Promise<boolean> {
        let game = await this.getGame(gameId);

        if (game && game.state && game.state.mode !== 'finished') {
            return false;
        }

        if (!game) {
            game = await this.createGame(gameId);
        } else {
            game.state = this.createNewGameState();
        }

        await this.clearGameStateHistory(game);
        await this.startGame(game);
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
                1,
                1,
                []
            );

            game.version++;
            await gameRepo.set(game.id, game);
            await this.checkGameState(game);

            this.schedulePlayAiTurnIfNecessary(game);

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

        // save the game state just before we perform the action, so we can easily revert it
        await this.saveGameState(game);

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
        const lastTurn = game.state.turn;
        const maxActions = Math.min(4, lastTurn.maxActions + 1);

        game.state.turn = new Turn(
            game.players[nextIndex].id,
            maxActions,
            maxActions,
            []
        );

        game.version++;
        await gameRepo.set(game.id, game);
        await this.clearGameStateHistory(game);

        this.schedulePlayAiTurnIfNecessary(game);

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
        await this.clearGameStateHistory(game);
    }

    async revertGameState(game: Game): Promise<boolean> {
        const history = await gameStateHistoryRepo.get(game.id);

        if (!history || history.length === 0) {
            return false;
        } else {
            const oldState = history.pop();

            await gameStateHistoryRepo.set(game.id, history);

            game.state = oldState;
            game.version++;

            await gameRepo.set(game.id, game);
        }
    }

    async saveGameState(game: Game): Promise<void> {
        let history = await gameStateHistoryRepo.get(game.id);
        if (history) {
            history.push(game.state);
        } else {
            history = [game.state];
        }
        await gameStateHistoryRepo.set(game.id, history);
    }

    async clearGameStateHistory(game: Game): Promise<void> {
        await gameStateHistoryRepo.set(game.id, []);
    }

    async addAiPlayer(game: Game): Promise<string> {
        if (game.players.length >= 4) {
            return 'Game is already full';
        }

        if (game.state.mode !== 'creating') {
            return `Game ${game.id} is already in progress`;
        }

        const aiPlayerNames = [
            'Bot Alpha',
            'Bot Beta',
            'Bot Gamma',
            'Bot Delta',
            'Bot Theta'
        ].filter(name => game.players.every(player => player.id !== name));

        const colours = ['black', 'blue', 'green', 'yellow']
            .filter(colour => game.players.every(player => player.colour !== colour)) as PlayerColour[];

        const aiPlayer: Player = new Player(
            aiPlayerNames[Math.floor(Math.random() * aiPlayerNames.length)],
            colours[Math.floor(Math.random() * colours.length)],
            'medium-ai'
        );

        game.players.push(aiPlayer);
        game.version++;
        await gameRepo.set(game.id, game);
        return undefined;
    }

    async kickAiPlayer(game: Game, player: Player): Promise<string> {
        if (game.state.mode !== 'creating') {
            return `Game ${game.id} is already in progress`;
        }

        if (player.isHuman) {
            return `Player ${player.id} is a human`;
        }

        game.players = game.players.filter(p => p.id !== player.id);
        game.version++;
        await gameRepo.set(game.id, game);
        return undefined;
    }

    async setAiDifficulty(game: Game, player: Player, difficulty: PlayerType): Promise<string> {
        if (game.state.mode !== 'creating') {
            return `Game ${game.id} is already in progress`;
        }

        if (player.isHuman) {
            return `Player ${player.id} is a human`
        }

        if (difficulty !== 'easy-ai' && difficulty !== 'medium-ai' && difficulty !== 'hard-ai') {
            return `Cannot set ai type to a non-ai type`;
        }

        player.type = difficulty;
        game.version++;
        await gameRepo.set(game.id, game);
        return undefined;
    }

    schedulePlayAiTurnIfNecessary(oldGame: Game): void {
        if (oldGame.state.mode !== 'playing') {
            return;
        }

        const aiPlayer = oldGame.players.find(player => player.id === oldGame.state.turn.playerId);
        if (aiPlayer && !aiPlayer.isHuman) {
            setTimeout(async () => {
                // in case game has somehow changed since the delay
                const game = await this.getGame(oldGame.id);
                const pauseTurn = async () => {
                    game.version++;
                    await gameRepo.set(game.id, game);
                    await this.checkGameState(game);

                    await new Promise(r => setTimeout(r, 1000));
                };

                try {
                    const gameFinished = await ai.playTurn(aiPlayer, game, game.state.turn.remainingActions, pauseTurn)
                    if (gameFinished) {
                        await this.endGame(game);
                        game.version++;
                        await gameRepo.set(game.id, game);
                    }
                } catch(e) {
                    console.warn('failed to process ai turn for some reason:');
                    console.error(e);
                }

                await this.endTurn(game, aiPlayer);
            }, 1000);
        }
    }
}

const gameService = new GameService();
export default gameService;
