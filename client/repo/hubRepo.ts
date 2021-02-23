import { Hub } from "../util/hub";
import { useGame } from "./gameRepo";
import { usePlayer } from "./playerRepo";


export const useHub = () => {
    const [game, setGame] = useGame();
    const [player, setPlayer] = usePlayer();
    return new Hub({ game, setGame, player, setPlayer });
};