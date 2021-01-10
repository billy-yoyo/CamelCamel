import { Action, MoveData, PickupData, PlaceData, TMoveData, TPickupData, TPlaceData, TransportData, TTransportData } from "../../common/model/game/action";
import { Delivery } from "../../common/model/game/delivery";
import { Game } from "../../common/model/game/game";
import { GameTile } from "../../common/model/game/gameTile";
import { Player } from "../../common/model/game/player";
import { PlayerColour } from "../../common/model/game/playerColour";
import gameService from "./gameService";

const MAX_CAMELS = 5;

interface ActionResult {
    message?: string;
    cost?: number;
    executor?: () => void;
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
        return tile.camels.filter(camel => camel.colour === colour);
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
                const camel = fromTile.camels.splice(index, 1)[0];
                toTile.camels.push(camel);
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

                const camel = tile.camels.find(camel => camel.colour === player.colour && camel.carrying === undefined);
                camel.carrying = resource;
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
        game.state.tiles.forEach(row => row.forEach(tile => {
            tile.camels.forEach(camel => {
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
                tile.camels.push({colour: player.colour, carrying: undefined});
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

        const fromCamel = fromTile.camels.find(camel => camel.colour === player.colour && camel.carrying === data.resource);
        const toCamel = toTile.camels.find(camel => camel.colour === player.colour && camel.carrying === undefined);

        if (!fromCamel) {
            return { message: `No camel belonging to ${player.id} carrying ${data.resource} at {x: ${data.from.x}, y: ${data.from.y}}` };
        }

        if (!toCamel) {
            return { message: `No camel belonging to ${player.id} carrying no resource at {x: ${data.to.x}, y: ${data.to.y}}` };
        }

        return {
            cost: 1,
            executor: () => {
                fromCamel.carrying = undefined;
                if (toTile.deliver === data.resource) {
                    game.state.deliveries.push(new Delivery(player.id, data.resource, 0));
                } else {
                    toCamel.carrying = data.resource;
                }
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
        }

        // should be impossible
        return { message: `Invalid action type ${action.type}` };
    }
}

const actionService = new ActionService();
export default actionService;
