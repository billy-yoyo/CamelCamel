import * as React from 'react';
import { GameTile } from '../../../common/model/game/gameTile';
import Tile from './tile';
import './board.less';

interface BoardProps {
    tiles: GameTile[][];
}

interface BoardRowProps {
    row: GameTile[];
}

const BoardRow = ({ row }: BoardRowProps): JSX.Element => {
    return (
        <div className="board-row">
            {
                row.map(tile => <Tile tile={tile}></Tile>)
            }
        </div>
    )
};

export default ({ tiles }: BoardProps): JSX.Element => {

    return (
        <div className="board">
            {
                tiles.map(row => <BoardRow row={row}></BoardRow>)
            }
        </div>
    )
};