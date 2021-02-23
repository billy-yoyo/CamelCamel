import { Camel } from "../../common/model/game/camel";
import { GameTile } from "../../common/model/game/gameTile";
import { PlayerColour } from "../../common/model/game/playerColour";
import { Resource } from "../../common/model/game/resource";

export type GameQueryType = 'select-tile' | 'select-camel';

export interface GameQuery<T> {
    name: GameQueryType;
    data: any;
    resolve: (value: T) => any;
    reject: (error: any) => void;
}

export class GameQueryBuilder {
    private setQuery: (query: GameQuery<any>) => any;

    constructor(setQuery: (query: GameQuery<any>) => any) {
        this.setQuery = setQuery;
    }

    private async makeQuery<T>(name: GameQueryType, data: any): Promise<T> {
        return new Promise((resolve, reject) => {
            const wrappedResolve = (value: any) => {
                this.setQuery(null);
                resolve(value);
            };

            const wrappedReject = (error: any) => {
                this.setQuery(null);
                reject(error);
            };

            this.setQuery({
                name,
                data,
                resolve: wrappedResolve,
                reject: wrappedReject
            })
        });
    }

    public async selectTile(): Promise<{x: number, y: number}> {
        const tile = await this.makeQuery<{x: number, y: number}>('select-tile', null);
        return tile;
    }

    public async selectCamel(tile: GameTile, filter: (camel: Camel) => boolean): Promise<{colour: PlayerColour, resource: Resource}> {
        const camels = tile.camels.filter(filter);
        if (camels.length === 0) {
            return undefined;
        } else if (camels.length === 1) {
            return { colour: camels[0].colour, resource: camels[0].carrying };
        } else {
            const camel = await this.makeQuery<{colour: PlayerColour, resource: Resource}>(
                'select-camel',
                camels
            );
            return camel;
        }
    }
}