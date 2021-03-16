import * as React from 'react';
import "./game.less";
import Board from '../components/game/board';
import Actions from '../components/game/actions';
import { Page } from '../../common/model/client/page';
import { GameQuery, GameQueryBuilder } from '../util/query';
import SelectCamel from '../components/game/selectCamel';
import Players from '../components/game/players';
import GameControls from '../components/game/gameControls';
import GameHeader from '../components/game/gameHeader';
import { useHub } from '../repo/hubRepo';
import { gameInStorage } from '../repo/gameRepo';
import gameLoop from '../service/gameLoopService';
import { isPortrait } from '../util/mediaQuery';
import Burger from '../images/burger';
import { Animation } from '../util/hub';

interface GameProps {
    pageData: any;
    setPage: (page: Page, pageData?: any) => void;
}

interface AnimationState {
    animations: {[id: string]: Animation};
    setAnimations: (animations: {[id: string]: Animation}) => void;
}

const AnimationState: AnimationState = {
    animations: {},
    setAnimations: undefined
};

export default ({ setPage }: GameProps): JSX.Element => {
    if (!gameInStorage()) {
        setPage('home');
    }

    const hub = useHub();
    const game = hub.game;
    const tiles = game?.state?.tiles;
    const [selected, setSelected] = React.useState<{x: number, y: number}>();
    const [query, setQuery] = React.useState<GameQuery<any>>();
    const [panelToggle, setPanelToggle] = React.useState<boolean>(false);

    const wrappedSetSelected = (pos: {x: number, y: number}) => {
        if (query && query.name === 'select-tile') {
            query.resolve(pos);
        }
        setSelected(pos);
    };

    const queryBuilder = new GameQueryBuilder(setQuery);

    gameLoop.setHub(hub);
    gameLoop.ensureRunning();

    const togglePanel = () => {
        setPanelToggle(!panelToggle);
    };  

    return (
        <div className="game">
            { isPortrait() &&
                <div className="game-side-panel-toggle button secondary" onClick={togglePanel}>
                    <Burger size="40px" colour="#339"/>
                </div>
            }
            <div className={isPortrait() ? 'game-side-panel ' + (panelToggle ? 'open' : '') : "game-side"}>
                <GameControls hub={hub}/>
                <Players game={game}/>
            </div>
            <div className="game-main">
                { query && query.name === 'select-camel' && <SelectCamel query={query}></SelectCamel> }
                <GameHeader hub={hub} query={query}/>
                <Board tiles={tiles} selected={selected} setSelected={wrappedSetSelected}></Board>
                <Actions hub={hub} tile={selected && tiles[selected.y] && tiles[selected.y][selected.x]} pos={selected} queryBuilder={queryBuilder}></Actions>
            </div>
        </div>
    )
};