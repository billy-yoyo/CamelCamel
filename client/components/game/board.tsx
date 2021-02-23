import * as React from 'react';
import { GameTile } from '../../../common/model/game/gameTile';
import Tile from './tile';
import './board.less';

interface BoardProps {
    tiles: GameTile[][];
    selected: { x: number, y: number };
    setSelected: (point: {x: number, y: number}) => void;
}

interface BoardRowProps {
    row: GameTile[];
    y: number;
    selected: { x: number, y: number };
    setSelected: (point: {x: number, y: number}) => void;
}

const BoardRow = ({ row, y, selected, setSelected }: BoardRowProps): JSX.Element => {
    return (
        <div className="board-row" key={y}>
            {
                row.map((tile, x) => <Tile tile={tile} x={x} y={y} selected={selected} setSelected={setSelected} key={`${x}:${y}`} />)
            }
        </div>
    )
};

export default ({ tiles, selected, setSelected }: BoardProps): JSX.Element => {

    return (
        <div className="board">
            {
                tiles.map((row, y) => <BoardRow row={row} y={y} selected={selected} setSelected={setSelected} key={y} />)
            }
        </div>
    )
};