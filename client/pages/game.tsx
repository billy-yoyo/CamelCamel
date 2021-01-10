import * as React from 'react';
import { GameTile } from '../../common/model/game/gameTile';
import { Resource } from '../../common/model/game/resource';
import "./game.less";
import Board from '../components/game/board';

function deliver(deliver: Resource) {
    return new GameTile([], undefined, deliver, 0);
}

function money() {
    return new GameTile([], undefined, undefined, 1);
}

function tile() {
    return new GameTile([], undefined, undefined, 0);
}

export default (): JSX.Element => {
    const tiles = [
        [money(),          tile(), tile(),           deliver('grey'),  tile(),          tile(), money()],
        [tile(),           tile(), tile(),           tile(),           tile(),          tile(), tile()],
        [tile(),           tile(), tile(),           deliver('red'),   tile(),          tile(), tile()],
        [deliver('green'), tile(), deliver('white'), tile(),           deliver('blue'), tile(), deliver('purple')],
        [tile(),           tile(), tile(),           deliver('brown'), tile(),          tile(), tile()],
        [tile(),           tile(), tile(),           tile(),           tile(),          tile(), tile()],
        [money(),          tile(), tile(),           deliver('pink'),  tile(),          tile(), money()],
    ];

    return (
        <div> 
            <Board tiles={tiles}></Board>     
        </div>
    )
};