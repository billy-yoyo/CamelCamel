import { GameTile } from "../../common/model/game/gameTile";
import { Player } from "../../common/model/game/player";

export interface Point {
    x: number;
    y: number;
}

export class Path {
    public tail: Path;
    public tile: Point;
    public cost: number;
    public score: number;
    public length: number;

    constructor(tail: Path, tile: Point, cost: number) {
        this.tail = tail;
        this.tile = tile;
        this.cost = cost;
        this.score = this.cost;
        if (this.tail) {
            this.score += this.tail.score;
        }
        this.length = 1 + (tail ? tail.length : 0);
    }

    branch(tile: Point, cost: number) {
        return new Path(this, tile, cost);
    }

    first() {
        let tail: Path = this;
        while (tail.tail) {
            tail = tail.tail;
        }
        return tail.tile;
    }

    toArray() {
        const arr: Point[] = [];
        let head: Path = this;
        while (head) {
            arr.unshift(head.tile);
            head = head.tail;
        }
        return arr;
    }
}

const insertPath = (paths: Path[], path: Path): void => {
    const index = paths.findIndex(otherPath => otherPath.score > path.score);
    if (index >= 0) {
        paths.splice(index, 0, path);
    } else {
        paths.push(path);
    }
};

const getTile = (tiles: GameTile[][], tile: Point): GameTile => {
    return tiles && tiles[tile.y] && tiles[tile.y][tile.x];
}

const countAvailableCamels = (player: Player, tiles: GameTile[][]): number => {
    return 0;
};

const getCost = (player: Player, tiles: GameTile[][], pos: Point, tail: Path, availableCamels: number): number => {
    const tile = getTile(tiles, pos);
    if ((!tail || tail.length < availableCamels) && tile.camels.some(camel => camel.colour === player.colour)) {
        return 0;
    } if (tile.camels.filter(camel => camel.colour !== player.colour).length === 0) {
        return 1;
    } else {
        return 2;
    }
};

const OFFSETS = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
const forEachUnvisitedNeighbour = (tiles: GameTile[][], pos: Point, visited: {[key: string]: boolean}, callback: (pos: Point) => void) => {
    const visit = (tile: Point) => { visited[`${tile.x}:${tile.y}`] = true; };
    const hasVisited = (tile: Point) => visited[`${tile.x}:${tile.y}`];
    OFFSETS.forEach(offset => {
        const newPos = { x: pos.x + offset.x, y: pos.y + offset.y };
        if (!hasVisited(newPos)) {
            const tile = getTile(tiles, newPos);
            if (tile) {
                visit(newPos);
                callback(newPos);
            }
        }
    });
};

export default (player: Player, tiles: GameTile[][], start: Point, end: Point): Path => {
    const availableCamels = countAvailableCamels(player, tiles);
    const visited: {[key: string]: boolean} = {};
    const addTile = (path: Path, pos: Point) => path.branch(pos, getCost(player, tiles, pos, path, availableCamels));

    const paths: Path[] = [
        new Path(undefined, start, getCost(player, tiles, start, undefined, availableCamels))
    ];

    let bestPath;

    while (!bestPath && paths.length > 0) {
        const path = paths.shift();
        forEachUnvisitedNeighbour(tiles, path.tile, visited, (pos) => {
            const newPath = addTile(path, pos);
            if (pos.x === end.x && pos.y === end.y) {
                bestPath = newPath;
            } else {
                insertPath(paths, newPath);
            }
        });
    }

    return bestPath;
};

