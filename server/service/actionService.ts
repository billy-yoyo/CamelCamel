import { Action, MoveData, PickupData, PlaceData, StealData, TMoveData, TPickupData, TPlaceData, TransportData, TStealData, TTransportData } from "../../common/model/game/action";
import { Delivery } from "../../common/model/game/delivery";
import { Game } from "../../common/model/game/game";
import { GameTile } from "../../common/model/game/gameTile";
import { Player } from "../../common/model/game/player";
import { PlayerColour } from "../../common/model/game/playerColour";

const MAX_CAMELS = 5;

interface ActionResult {
    message?: string;
    cost?: number;
    // returns whether or not the game should end as a result of this action
    executor?: () => boolean;
}

export class ActionService {
    private findTile(game: Game, point: {x: number, y: number}): GameTile {
        if (point.y < 0 || point.y >= game.state.tiles.length) {
            return null;
        }

        if (point.x < 0 || point.x >= game.state.tiles[0].length) {
            return null;
        }

        return game.state.tiles[point.y][point.x];
    }

    private findCamels(tile: GameTile, colour: PlayerColour) {
        return tile ? tile.camels.filter(camel => camel.colour === colour) : [];
    }

    private hasPath(game: Game, from: {x: number, y: number}, to: {x: number, y: number}, colour: PlayerColour): boolean {
        const tiles = game.state.tiles;
        const hasCamel = ({ x, y }: {x: number, y: number}) => this.findCamels(tiles[y] && tiles[y][x], colour).length > 0

        if (!hasCamel(from)) {
            return false;
        }

        const visited: {[key: string]: boolean} = {}
        const visit = ({ x, y }: {x: number, y: number}) => {
            visited[`${x}:${y}`] = true;
        };
        const hasVisited = ({ x, y }: {x: number, y: number}) => visited[`${x}:${y}`];
        const offsets: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        visit(from);
        let stack: {x: number, y: number}[] = [from];
        let found = false;
        while (!found && stack.length > 0) {
            const newStack: {x: number, y: number}[] = [];
            stack.forEach(tile => {
                offsets.forEach(([ox, oy]) => {
                    const otile = { x: tile.x + ox, y: tile.y + oy };
                    if (!hasVisited(otile) && hasCamel(otile)) {
                        if (otile.x === to.x && otile.y === to.y) {
                            found = true;
                        } else {
                            visit(otile);
                            newStack.push(otile);
                        }
                    }
                });
            });
            stack = newStack;
        }

        return found;
    }


    performMoveAction(game: Game, player: Player, data: MoveData): ActionResult {
        const fromTile = this.findTile(game, data.from);
        const toTile = this.findTile(game, data.to);

        if (!fromTile) {
            return { message: `Invalid from tile {x: ${data.from.x}, y: ${data.from.y}}` };
        }

        if (!toTile) {
            return { message: `Invalid to tile {x: ${data.to.x}, y: ${data.to.y}}` };
        }

        if (data.from.x === data.to.x && data.from.y === data.to.y) {
            return { message: `Cannot move to the tile the camel is already on` };
        }

        const camels = this.findCamels(fromTile, player.colour);
        if (camels.length === 0) {
            return { message: `No camel belonging to player ${player.id} at tile {x: ${data.from.x}, y: ${data.from.y}}` };
        }

        if (camels.every(camel => camel.carrying !== undefined)) {
            return { message: `All camels belonging to player ${player.id} at tile {x: ${data.from.x}, y: ${data.from.y}} are carrying a resource` };
        }

        return {
            cost: toTile.camels.length === 0 ? 1 : 2,
            executor: () => {
                const index = fromTile.camels.findIndex(camel => camel.colour === player.colour && camel.carrying === undefined);
                const targetCamel = fromTile.camels.splice(index, 1)[0];
                toTile.camels.push(targetCamel);
                return false;
            }
        };
    }

    performPickupAction(game: Game, player: Player, data: PickupData): ActionResult {
        const tile = this.findTile(game, data.tile);
        if (!tile) {
            return { message: `Invalid tile {x: ${data.tile.x}, y: ${data.tile.y}}` };
        }

        const camels = this.findCamels(tile, player.colour);
        if (camels.length === 0) {
            return { message: `No camel belonging to player ${player.id} at tile {x: ${data.tile.x}, y: ${data.tile.y}}` };
        }

        if (camels.every(camel => camel.carrying !== undefined)) {
            return { message: `All camelss belonging to player ${player.id} at tile {x: ${data.tile.x}, y: ${data.tile.y}} are carrying a resource` };
        }

        if (tile.resource === undefined) {
            return { message: `No resource at tile {x: ${data.tile.x}, y: ${data.tile.y}}` };
        }

        return {
            cost: 1,
            executor: () => {
                const resource = tile.resource;
                tile.resource = undefined;

                if (tile.money > 0) {
                    game.state.deliveries.push(new Delivery(player.id, undefined, tile.money));
                    tile.money = 0;
                }

                const targetCamel = tile.camels.find(camel => camel.colour === player.colour && camel.carrying === undefined);
                targetCamel.carrying = resource;
                return false;
            }
        };
    }

    performPlaceAction(game: Game, player: Player, data: PlaceData): ActionResult {
        const tile = this.findTile(game, data.tile);
        if (!tile) {
            return { message: `Invalid tile {x: ${data.tile.x}, y: ${data.tile.y}}` };
        }

        // count number of camels belonging to player
        let count = 0;
        game.state.tiles.forEach(row => row.forEach(t => {
            t.camels.forEach(camel => {
                if (camel.colour === player.colour) {
                    count++;
                }
            })
        }));

        if (count >= MAX_CAMELS) {
            return { message: `All of ${player.id}'s camels are already on the board` };
        }

        return {
            cost: tile.camels.length === 0 ? 1 : 2,
            executor: () => {
                tile.camels.push({colour: player.colour, carrying: undefined, isResourceSafe: false});
                return false;
            }
        };
    }

    performTransportAction(game: Game, player: Player, data: TransportData): ActionResult {
        const fromTile = this.findTile(game, data.from);
        const toTile = this.findTile(game, data.to);

        if (!fromTile) {
            return { message: `Invalid from tile {x: ${data.from.x}, y: ${data.from.y}}` };
        }

        if (!toTile) {
            return { message: `Invalid to tile {x: ${data.to.x}, y: ${data.to.y}}` };
        }

        if (data.from.x === data.to.x && data.from.y === data.to.y) {
            return { message: `Cannot transport to the tile the camel is already on` };
        }

        const fromCamel = fromTile.camels.find(camel => camel.colour === player.colour && camel.carrying === data.resource);
        const toCamel = toTile.camels.find(camel => camel.colour === player.colour && camel.carrying === undefined);

        if (!fromCamel) {
            return { message: `No camel belonging to ${player.id} carrying ${data.resource} at {x: ${data.from.x}, y: ${data.from.y}}` };
        }

        if (!toCamel) {
            return { message: `No camel belonging to ${player.id} carrying no resource at {x: ${data.to.x}, y: ${data.to.y}}` };
        }

        if (!this.hasPath(game, data.from, data.to, player.colour)) {
            return { message: `Cannot find a path of camels belonging to ${player.id} from {x: ${data.from.x}, y: ${data.from.y}} to {x: ${data.to.x}, y: ${data.to.y}}` };
        }

        return {
            cost: 1,
            executor: () => {
                fromCamel.carrying = undefined;
                fromCamel.isResourceSafe = false;
                if (toTile.deliver === data.resource) {
                    game.state.deliveries.push(new Delivery(player.id, data.resource, 0));
                    if (game.state.finalTurn) {
                        return true;
                    }
                } else {
                    toCamel.carrying = data.resource;
                    toCamel.isResourceSafe = false;
                }
                return false;
            }
        }
    }

    performStealAction(game: Game, player: Player, data: StealData): ActionResult {
        if (game.state.stealTokens[player.id] <= 0) {
            return { message: `Player ${player.id} has no steal actions remaining` };
        }

        const tile = this.findTile(game, data.tile);

        if (!tile) {
            return { message: `Invalid tile {x: ${data.tile.x}, y: ${data.tile.y}}` };
        }

        const targetCamel = tile.camels.find(camel => camel.colour === data.targetColour && camel.carrying === data.targetResource && !camel.isResourceSafe);
        const receivingCamel = tile.camels.find(camel => camel.colour === player.colour && camel.carrying === undefined);

        if (!targetCamel) {
            return { message: `No camel of colour ${data.targetColour} carrying resource ${data.targetResource} is at {x: ${data.tile.x}, y: ${data.tile.y}} to steal from` };
        }

        if (!receivingCamel) {
            return { message: `No camel belonging to ${player.id} carrying no resource at {x: ${data.tile.x}, y: ${data.tile.y}}` };
        }

        const targetPlayer = game.players.find(p => p.colour === targetCamel.colour);

        if (!targetPlayer) {
            return { message: `Cannot find a player with colour matching the target camel` };
        }

        return {
            cost: 1,
            executor: () => {
                receivingCamel.carrying = targetCamel.carrying;
                targetCamel.carrying = undefined;
                receivingCamel.isResourceSafe = true;
                game.state.stealTokens[player.id] = Math.max(0, game.state.stealTokens[player.id] - 1);
                game.state.stealTokens[targetPlayer.id] += 1;
                return false;
            }
        }
    }

    performAction(game: Game, player: Player, action: Action): ActionResult {
        if (action.type === 'move') {
            if (!TMoveData.valid(action.data)) {
                return { message: `Invalid move data` };
            }

            return this.performMoveAction(game, player, TMoveData.toModel(action.data));
        } else if (action.type === 'pickup') {
            if (!TPickupData.valid(action.data)) {
                return { message: `Invalid pickup data` };
            }

            return this.performPickupAction(game, player, TPickupData.toModel(action.data));
        } else if (action.type === 'place') {
            if (!TPlaceData.valid(action.data)) {
                return { message: `Invalid place data` };
            }

            return this.performPlaceAction(game, player, TPlaceData.toModel(action.data));
        } else if (action.type === 'transport') {
            if (!TTransportData.valid(action.data)) {
                return { message: `Invalid transpot data` };
            }

            return this.performTransportAction(game, player, TTransportData.toModel(action.data));
        } else if (action.type === 'steal') {
            if (!TStealData.valid(action.data)) {
                return { message: `Invalid steal data` };
            }

            return this.performStealAction(game, player, TStealData.toModel(action.data));
        }

        // should be impossible
        return { message: `Invalid action type ${action.type}` };
    }
}

const actionService = new ActionService();
export default actionService;
