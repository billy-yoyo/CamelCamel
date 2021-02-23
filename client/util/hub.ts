import { Game } from "../../common/model/game/game";
import { Player } from "../../common/model/game/player";
import { shouldUpdate, getGame } from '../service/networkService';

interface HubProps {
    game: Game;
    player: Player;
    setGame: (game: Game) => void;
    setPlayer: (player: Player) => void;
}

export class Hub {
    public readonly game: Game;
    public readonly player: Player;

    public setGame: (game: Game) => void;
    public setPlayer: (player: Player) => void;

    private loopHash: number;

    constructor(props: HubProps) {
        this.game = props.game;
        this.player = props.player;
        this.setGame = props.setGame;
        this.setPlayer = props.setPlayer;
        this.loopHash = 0;
    }

    public async refreshGame(): Promise<void> {
        if (this.game.id) {
            const game = await getGame(this.game.id);

            if (game.data) {
                this.setGame(game.data);
            } else {
                console.warn(`failed to refresh game:`)
                console.warn(game.error);
            }
        }
    }
}
