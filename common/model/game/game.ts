import T from 'tsplate';
import { GameState, TGameState } from './gameState';
import { Player, TPlayer } from './player';

@T.constructor("id", "state", "lifetime", "players", "version")
export class Game {
    @T.template(T.String)
    public id: string;

    @T.template(TGameState)
    public state: GameState;

    @T.template(T.Float)
    public lifetime: number;

    @T.template(T.Array(TPlayer))
    public players: Player[];

    @T.template(T.Int)
    public version: number;

    constructor(id: string, state: GameState, lifetime: number, players: Player[], version: number) {
        this.id = id;
        this.state = state;
        this.lifetime = lifetime;
        this.players = players;
        this.version = version;
    }
}

export const TGame = T.AutoClass(Game);
