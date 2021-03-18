import { Hub } from "../util/hub";
import { useGame } from "./gameRepo";
import { useMessages } from "./messageRepo";
import { usePlayer } from "./playerRepo";


export const useHub = () => {
    const [game, setGame] = useGame();
    const [player, setPlayer] = usePlayer();
    const [messages, setMessages] = useMessages();
    return new Hub({ game, setGame, player, setPlayer, messages, setMessages });
};