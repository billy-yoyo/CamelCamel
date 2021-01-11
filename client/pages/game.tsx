import * as React from 'react';
import { GameTile } from '../../common/model/game/gameTile';
import { Resource } from '../../common/model/game/resource';
import "./game.less";
import Board from '../components/game/board';
import Actions from '../components/game/actions';
import { Camel } from '../../common/model/game/camel';

function deliver(deliver: Resource) {
    return new GameTile([ new Camel('yellow', 'blue', false) ], undefined, deliver, 0, 0);
}

function money(c: number) {
    return new GameTile([ new Camel('blue', 'pink', true) ], "pink", undefined, c, 1);
}

function spawn(c: number) {
    return new GameTile([ new Camel('black', 'brown', false) ], "grey", undefined, c, 0);
}

function tile() {
    return new GameTile([ new Camel('green', 'purple', false) ], undefined, undefined, 0, 0);
}



export default (): JSX.Element => {
    let c = 1;
    const tiles = [
        [money(c++),       tile(),     tile(),           deliver('grey'),  tile(),          tile(),     money(c++)],
        [tile(),           spawn(c++), tile(),           tile(),           tile(),          spawn(c++), tile()],
        [tile(),           tile(),     tile(),           deliver('red'),   tile(),          tile(),     tile()],
        [deliver('green'), tile(),     deliver('white'), tile(),           deliver('blue'), tile(),     deliver('purple')],
        [tile(),           tile(),     tile(),           deliver('brown'), tile(),          tile(),     tile()],
        [tile(),           spawn(c++), tile(),           tile(),           tile(),          spawn(c++), tile()],
        [money(c++),       tile(),     tile(),           deliver('pink'),  tile(),          tile(),     money(c++)],
    ];
    const [selected, setSelected] = React.useState<{x: number, y: number}>();

    return (
        <div className="game"> 
            <Board tiles={tiles} selected={selected} setSelected={setSelected}></Board>     
            <Actions tile={selected && tiles[selected.y] && tiles[selected.y][selected.x]}></Actions>
        </div>
    )
};