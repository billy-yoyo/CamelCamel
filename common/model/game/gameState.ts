import { strict } from 'assert';
import T, { ModelType } from 'tsplate';
import { Delivery, TDelivery } from './delivery';
import { GameTile, TGameTile } from './gameTile';
import { Resource, TResource } from './resource';
import { TTurn, Turn } from './turn';

const TMode = T.Enum('creating', 'playing', 'finished');
type Mode = ModelType<typeof TMode>;

@T.constructor("mode", "turn", "tiles", "deliveries", "bag", "finalTurn", "stealTokens")
export class GameState {
    @T.template(TMode)
    public mode: Mode;

    @T.template(T.Optional(TTurn))
    public turn: Turn;

    @T.template(T.Array(T.Array(TGameTile)))
    public tiles: GameTile[][];

    @T.template(T.Array(TDelivery))
    public deliveries: Delivery[];

    @T.template(T.Record(TResource, T.Int))
    public bag: Record<Resource, number>;

    @T.template(T.Boolean)
    public finalTurn: boolean;

    @T.template(T.Record(T.String, T.Int))
    public stealTokens: Record<string, number>;

    constructor(
        mode: Mode,
        turn: Turn,
        tiles: GameTile[][],
        deliveries: Delivery[],
        bag: Record<Resource, number>,
        finalTurn: boolean,
        stealTokens: Record<string, number>
    ) {
        this.mode = mode;
        this.turn = turn;
        this.tiles = tiles;
        this.deliveries = deliveries;
        this.bag = bag;
        this.finalTurn = finalTurn;
        this.stealTokens = stealTokens;
    }

    countTiles(counter: (tile: GameTile) => number) {
        return this.tiles.reduce((total, row) => (
            total + row.reduce((subtotal, t) => subtotal + counter(t), 0)
        ), 0);
    }
}

export const TGameState = T.AutoClass(GameState);
