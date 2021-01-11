import * as React from 'react';
import { GameTile } from '../../../common/model/game/gameTile';
import Octagon from '../../images/octagon';
import './tile.less';
import Camel from './camel';

interface TileProps {
    tile: GameTile;
    x: number;
    y: number;
    selected: { x: number, y: number };
    setSelected: (point: {x: number, y: number}) => void;
}

export default ({ tile, x, y, selected, setSelected }: TileProps): JSX.Element => {
    const isSelected = selected && selected.x === x && selected.y === y;
    const onClick = () => setSelected({ x, y });

    const classes = ['tile'];
    if (isSelected) {
        classes.push('selected');
    }
    const tileClass = classes.join(' ');

    return (
        <div className={tileClass} onClick={onClick}>
            {
                tile.deliver ? (
                    <div className="octagon">
                        <Octagon width="90px" height="90px" fill={tile.deliver} stroke={tile.deliver}></Octagon>
                    </div>
                 ) : null
            }

            {
                tile.spawnId > 0 ? (
                    <div className="spawn">
                        {tile.spawnId}
                    </div>
                ) : null
            }

            <div className="items">
                {
                    tile.money > 0 ? (
                        <div className="money">
                            {tile.money}
                        </div>
                    ) : null
                }

                {
                    tile.resource ? (
                        <div className="resource" style={{backgroundColor: tile.resource}}></div>
                    ) : null
                }

                {
                    tile.camels.map(camel => (
                        <Camel camel={camel}></Camel>
                    ))
                }
            </div>
            
        </div>
    )
};