import T, { ModelType } from 'tsplate';
import { Delivery, TDelivery } from './delivery';
import { GameTile, TGameTile } from './gameTile';
import { Resource, TResource } from './resource';
import { TTurn, Turn } from './turn';

const TMode = T.Enum('creating', 'playing', 'finished');
type Mode = ModelType<typeof TMode>;

@T.constructor("mode", "turn", "tiles", "deliveries")
export class GameState {
    @T.template(TMode)
    public mode: Mode;

    @T.template(T.Optional(TTurn))
    public turn: Turn;

    @T.template(T.Array(T.Array(TGameTile)))
    public tiles: GameTile[][];

    @T.template(T.Array(TDelivery))
    public deliveries: Delivery[];

    constructor(mode: Mode, turn: Turn, tiles: GameTile[][], deliveries: Delivery[]) {
        this.mode = mode;
        this.turn = turn;
        this.tiles = tiles;
        this.deliveries = deliveries;
    }
}

export const TGameState = T.AutoClass(GameState);
