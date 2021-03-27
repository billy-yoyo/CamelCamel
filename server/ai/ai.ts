import { Delivery } from "../../common/model/game/delivery";
import { Game } from "../../common/model/game/game";
import { GameState } from "../../common/model/game/gameState";
import { Player } from "../../common/model/game/player";
import { Resource } from "../../common/model/game/resource";
import pathFind, { Point, Path } from './pathFind';
import actionService, { ActionResult } from '../service/actionService';
import { addSyntheticLeadingComment } from "typescript";
import { PlayerColour } from "../../common/model/game/playerColour";

/*
AI looks for the highest score per action

*/

type CubeType = 'pickup' | 'carrying' | 'steal';

interface Cube {
    resource: Resource;
    money: number;
    tile: Point;
    destination: Point;
    type: CubeType;
    targetPlayer?: PlayerColour;
}

interface CubePath {
    cube: Cube;
    path: Path;
    score: number;
}

const getAvailableCubes = (player: Player, state: GameState): Cube[] => {
    const cubes: Cube[] = [];
    const destinations: Partial<{[key in Resource]: Point}> = {};
    state.tiles.forEach((tileRow, y) => {
        tileRow.forEach((tile, x) => {
            tile.camels.forEach((camel) => {
                if (camel.colour === player.colour && camel.carrying !== undefined) {
                    cubes.push({
                        resource: camel.carrying,
                        money: 0,
                        tile: { x, y },
                        destination: undefined,
                        type: 'carrying'
                    });
                } else if (state.stealTokens[player.id] > 0 && camel.carrying !== undefined && !camel.isResourceSafe) {
                    // easy ai won't steal, and medium ai is less likely
                    if (player.type === 'hard-ai' || (player.type === 'medium-ai' && Math.random() < 0.75)) {
                        cubes.push({
                            resource: camel.carrying,
                            money: 0,
                            tile: { x, y },
                            destination: undefined,
                            type: 'steal',
                            targetPlayer: camel.colour
                        });
                    }
                }
            });
            if (tile.resource) {
                cubes.push({
                    resource: tile.resource,
                    money: tile.money,
                    tile: { x, y },
                    destination: undefined,
                    type: 'pickup'
                });
            }
            if (tile.deliver) {
                destinations[tile.deliver] = { x, y };
            }
        });
    });
    cubes.forEach(cube => {
        cube.destination = destinations[cube.resource];
    });
    return cubes;
};

const getPlayerCamelTiles = (player: Player, state: GameState): Point[] => {
    const camelTiles: Point[] = [];
    state.tiles.forEach((tileRow, y) => {
        tileRow.forEach((tile, x) => {
            if (tile.camels.some(camel => camel.colour === player.colour && camel.carrying === undefined)) {
                camelTiles.push({ x, y });
            }
        });
    });
    return camelTiles;
};

const getValue = (cube: Cube): number => {
    const delivery = new Delivery('ai', cube.resource, cube.money);
    return delivery.countScore();
};

const getCubePath = (player: Player, state: GameState, cube: Cube): CubePath => {
    if (cube.destination === undefined) {
        throw new Error(`cube destination is undefined for resource ${cube.resource}`)
    }
    const path = pathFind(player, state.tiles, cube.tile, cube.destination);
    if (path) {
        let value = getValue(cube);
        let pathScore = path.score;
        if (cube.type === 'pickup' || cube.type === 'steal') {
            const firstInPath = path.first();
            const firstTile = state.tiles[firstInPath.y][firstInPath.x];
            if (!firstTile.camels.some(camel => camel.colour === player.colour && camel.carrying === undefined)) {
                pathScore += 1;
            }
            pathScore += 1;
        } else if (cube.type === 'carrying') {
            // increase effective value to account for the value of freeing up a camel
            value += 1.2;
        }

        // account for transport costs
        let availableCamels = getPlayerCamelTiles(player, state).length;
        if (cube.type === 'carrying') {
            availableCamels += 1;
        }
        pathScore += Math.floor(path.length / availableCamels) + 1;

        if (player.type === 'easy-ai') {
            value += Math.random() * 3;
            pathScore += Math.random() * 3;
        } else if (player.type === 'medium-ai') {
            value += Math.random();
            pathScore += Math.random();
        }

        return { cube, path, score: value / pathScore };
    } else {
        return { cube, path: undefined, score: 0 };
    }
};

const isPointInPath = (point: Point, pathTiles: Point[]) => {
    return pathTiles.some(tile => tile.x === point.x && tile.y === point.y);
};

const ensureCamelPlaced = (player: Player, game: Game, pos: Point, pathTiles: Point[]): ActionResult => {
    const tile = game.state.tiles[pos.y][pos.x];
    if (!tile.camels.some(camel => camel.colour === player.colour && camel.carrying === undefined)) {
        const placedCamels = game.state.countTiles(
            t => t.camels.filter(c => c.colour === player.colour).length
        );
        if (placedCamels < game.camelLimit) {
            return actionService.performPlaceAction(game, player, {
                tile: pos
            });
        } else {
            // pick a camel to move according to criteria:
            //   1. tiles not in path
            //   2. furthest away tile on path
            const camelTiles = getPlayerCamelTiles(player, game.state);
            const camelNotOnPath = camelTiles.find(camelTile => !isPointInPath(camelTile, pathTiles));
            if (camelNotOnPath) {
                return actionService.performMoveAction(game, player, {
                    from: camelNotOnPath,
                    to: pos
                });
            } else {
                const pathIndex = pathTiles.findIndex(t => t.x === pos.x && t.y === pos.y);

                if (pathIndex === -1) {
                    return { message: `Attempted to place camel on a tile outside of the current path: ${JSON.stringify(pos)}` }
                }

                const furthestCamel = camelTiles
                    .filter(ct => pathTiles.findIndex(t => t.x === ct.x && t.y === ct.y) > pathIndex)
                    .map(camelTile => ({
                        tile: camelTile,
                        distance: Math.abs(pos.x - camelTile.x) + Math.abs(pos.y - camelTile.y)
                    }))
                    .sort((a, b) => a.distance - b.distance)
                    .pop();

                if (furthestCamel) {
                    return actionService.performMoveAction(game, player, {
                        from: furthestCamel.tile,
                        to: pos
                    });
                } else {
                    return {
                        cost: 0,
                        executor: () => false
                    };
                }
            }
        }
    } else {
        return {
            cost: 0,
            executor: () => false
        };
    }
};

class TurnState {
    public gameFinished: boolean;
    public remainingActions: number;
    public success: boolean;
    public anySuccess: boolean;
    private pauseTurn: () => Promise<void>;

    constructor(remainingActions: number, pauseTurn: () => Promise<void>) {
        this.gameFinished = false;
        this.remainingActions = remainingActions;
        this.success = this.success;
        this.anySuccess = false;
        this.pauseTurn = pauseTurn;
    }

    async playAction(action: ActionResult): Promise<void> {
        if (this.gameFinished) {
            this.success = false;
            return;
        }

        const result = action;
        if (result.message) {
            throw Error(result.message);
        } else if (this.remainingActions >= result.cost) {
            this.gameFinished = result.executor();
            this.remainingActions -= result.cost;
            this.success = true;
            if (result.cost > 0) {
                this.anySuccess = true;
                await this.pauseTurn();
            }
        } else {
            this.success = false;
        }
    };
}

export const playTurn = async (player: Player, game: Game, remainingActions: number, pauseTurn: () => Promise<void>): Promise<boolean> => {
    const cubes = getAvailableCubes(player, game.state);
    const bestPath = cubes.map(cube => getCubePath(player, game.state, cube))
        .filter(x => x.path !== undefined)
        .sort((a, b) => a.score - b.score)
        .pop();

    const tiles = bestPath.path.toArray();
    console.log(`${bestPath.cube.type} ${bestPath.cube.resource} from ${JSON.stringify(bestPath.cube.tile)} to ${JSON.stringify(bestPath.cube.destination)} (length ${bestPath.path.length}, score ${bestPath.score})`)
    const state: TurnState = new TurnState(remainingActions, pauseTurn);

    const fullPath = tiles.slice();
    const firstTile = tiles.shift();
    const firstGameTile = game.state.tiles[firstTile.y][firstTile.x];
    let carryingCube = firstGameTile.camels.some(camel => camel.colour === player.colour && camel.carrying === bestPath.cube.resource);

    if (!carryingCube) {
        if (bestPath.cube.type === 'pickup') {
            await state.playAction(ensureCamelPlaced(player, game, firstTile, fullPath));

            if (state.success) {
                await state.playAction(actionService.performPickupAction(game, player, {
                    tile: firstTile
                }));

                if (state.success) {
                    carryingCube = true;
                }
            }
        } else if (bestPath.cube.type === 'steal') {
            await state.playAction(ensureCamelPlaced(player, game, firstTile, fullPath));

            if (state.success) {
                await state.playAction(actionService.performStealAction(game, player, {
                    tile: firstTile,
                    targetResource: bestPath.cube.resource,
                    targetColour: bestPath.cube.targetPlayer
                }));

                if (state.success) {
                    carryingCube = true;
                }
            }
        } else {
            carryingCube = true;
        }
    }

    let index = 0;
    const maxIndex = Math.min(tiles.length, game.camelLimit - 1);
    while (!state.gameFinished && state.remainingActions > 0 && index < maxIndex) {
        await state.playAction(ensureCamelPlaced(player, game, tiles[index], fullPath));
        index += 1;
    }

    // move the cube down the path
    if (state.remainingActions > 0 && carryingCube) {
        const availableTileIndices: number[] = [];
        tiles.some((tile, i) => {
            const gameTile = game.state.tiles[tile.y][tile.x];
            if (!gameTile.camels.some(camel => camel.colour === player.colour)) {
                return true;
            } else if (gameTile.camels.some(camel => camel.colour === player.colour && camel.carrying === undefined)) {
                availableTileIndices.push(i);
            }
        });

        // try and be safe with cube positioning if we're near the end
        const availableCamels = getPlayerCamelTiles(player, game.state).length;
        let lastAvailableTileIndex = availableTileIndices[availableTileIndices.length - 1];

        console.log(availableTileIndices);

        if (lastAvailableTileIndex + 1 === tiles.length) {
            lastAvailableTileIndex = availableTileIndices.pop();
        } else if (tiles.length - (lastAvailableTileIndex + 1) < availableCamels) {
            // the final tile is within a single jump of the destination
            // so pick the tile furthest from the destination still within a single jump
            let lastAvailableTileIndices = availableTileIndices.filter(i => tiles.length - (i + 1) < availableCamels)

            // hard ai always picks best option
            // medium ai picks between 2 best
            // easy ai picks between 4 best
            if (player.type === 'hard-ai') {
                lastAvailableTileIndex = lastAvailableTileIndices.pop();
            } else {
                if (player.type === 'medium-ai') {
                    lastAvailableTileIndices = lastAvailableTileIndices.slice(-2);
                } else if (player.type === 'easy-ai') {
                    lastAvailableTileIndices = lastAvailableTileIndices.slice(-4);
                }
                lastAvailableTileIndex = lastAvailableTileIndices[Math.floor(Math.random() * lastAvailableTileIndices.length)];
            }
        } else {
            lastAvailableTileIndex = availableTileIndices.pop();
        }

        const lastAvailableTile = tiles[lastAvailableTileIndex];

        if (lastAvailableTile) {
            await state.playAction(actionService.performTransportAction(game, player, {
                from: firstTile,
                to: lastAvailableTile,
                resource: bestPath.cube.resource
            }));

            // if we successfully transport & still have actions left, we play another turn with the remaining actions
            // as long as we had at least one success this turn - otherwise we stop to prevent infinite loops
            if (state.success && state.remainingActions > 0 && !state.gameFinished) {
                return await playTurn(player, game, state.remainingActions, pauseTurn);
            }
        }
    }

    return state.gameFinished;
};
