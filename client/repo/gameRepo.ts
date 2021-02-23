import { Game, TGame } from "../../common/model/game/game";
import useLocalStorage from "../util/useLocalStorage";

export const storeGame = (game: Game) => {
    localStorage.setItem('game', JSON.stringify(TGame.toTransit(game)));
};

export const gameInStorage = () => {
    const item = window.localStorage.getItem('game');
    if (item) {
        const parsed = JSON.parse(item);
        if (TGame.valid(parsed)) {
            return true;
        }
    }
    return false;
}

export const useGame = (): [Game, (game: Game) => void] => useLocalStorage('game', TGame);


