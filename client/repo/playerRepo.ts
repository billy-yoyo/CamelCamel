import { Player, TPlayer } from "../../common/model/game/player";
import { Hub } from "../util/hub";
import useLocalStorage from "../util/useLocalStorage";


export const storePlayer = (player: Player) => {
    localStorage.setItem('player', JSON.stringify(TPlayer.toTransit(player)));
};

export const usePlayer = (): [Player, (player: Player) => void] => useLocalStorage('player', TPlayer);
