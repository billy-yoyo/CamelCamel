import { Game } from "../../common/model/game/game";
import { Player } from "../../common/model/game/player";
import { Messages } from "../../common/model/response/messages";
import { getGame } from '../service/networkService';

export interface Animation {
    render: () => JSX.Element;
    duration: number;
}

interface HubProps {
    game: Game;
    player: Player;
    messages: Messages;
    setGame: (game: Game) => void;
    setPlayer: (player: Player) => void;
    setMessages: (messages: Messages) => void;
}

export class Hub {
    public readonly game: Game;
    public readonly player: Player;
    public readonly messages: Messages;

    public setGame: (game: Game) => void;
    public setPlayer: (player: Player) => void;
    public setMessages: (messages: Messages) => void;

    private loopHash: number;

    constructor(props: HubProps) {
        this.game = props.game;
        this.player = props.player;
        this.messages = props.messages;
        this.setGame = props.setGame;
        this.setPlayer = props.setPlayer;
        this.setMessages = props.setMessages;
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
