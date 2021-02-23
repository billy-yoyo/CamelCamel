import { Action } from '../../common/model/game/action';
import { Player } from '../../common/model/game/player';
import gameApi from './apis/gameApi';

const genRandomId = (length: number) => {
    const alphabet = 'abcdefghjiklmnoprstuvwxyz';
    return new Array(length).fill(0).map(() => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
}

const randomIdPrefix = genRandomId(32);
const randomId = () => {
    return `${randomIdPrefix}-${genRandomId(16)}`
};


test('can create game', async () => {
    const id = randomId();

    await gameApi.createGame(id)
        .is2xx().model({ id }).assert();
});

test('cannot get nonexistant game', async () => {
    const id = randomId();

    await gameApi.getGame(id)
        .isNot2xx().assert();
});

test('can join game', async () => {
    const id = randomId();
    const name = 'example-player';
    const colour = 'blue';

    await gameApi.createGame(id)
        .is2xx().assert();
    
    await gameApi.joinGame(id, new Player(name, colour))
        .is2xx().model({  
            players: [ 
                { id: name, colour } 
            ] 
        }).assert();
});

test('cannot join nonexistant game', async () => {
    const id = randomId();
    const name = 'example-player';
    const colour = 'blue';

    await gameApi.joinGame(id, new Player(name, colour))
        .isNot2xx().assert();
});

test('can start a game', async () => {
    const id = randomId();
    const name = 'example-player';
    const colour = 'blue';

    await gameApi.createGame(id)
        .is2xx().assert();

    await gameApi.joinGame(id, new Player(name, colour))
        .is2xx().assert();

    await gameApi.startGame(id)
        .is2xx().assert();

    await gameApi.getGame(id)
        .is2xx().model({ state: { mode: 'playing' } }).assert();
});

test('can use the place action', async() => {
    const id = randomId();
    const name = 'example-player';
    const colour = 'blue';

    await gameApi.createGame(id)
        .is2xx().assert();

    await gameApi.joinGame(id, new Player(name, colour))
        .is2xx().assert();
    
    await gameApi.startGame(id)
        .is2xx().assert();

    await gameApi.doAction(id, name, new Action('place', { tile: { x: 0, y: 0 } }))
        .is2xx().model({ remainingActions: 3 }).assert();

    await gameApi.getGame(id)
        .is2xx().model({ state: { tiles: [ [ { camels: [ { colour } ] } ] ] } }).assert();
});