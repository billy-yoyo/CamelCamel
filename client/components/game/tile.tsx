import * as React from 'react';
import { GameTile } from '../../../common/model/game/gameTile';
import Octagon from '../../images/octagon';
import './tile.less';

interface TileProps {
    tile: GameTile;
}

export default ({ tile }: TileProps): JSX.Element => {
    console.log(tile);
    return (
        <div className="tile">
            {
                tile.deliver ? (
                    <div className="">
                        <Octagon width="90px" height="90px" fill={tile.deliver} stroke={tile.deliver}></Octagon>
                    </div>
                 ) : null
            }
            
        </div>
    )
};