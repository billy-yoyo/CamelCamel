import { Game, TGame } from '../../common/model/game/game';
import store from '../store';

const gameRepo = store.createTemplateStore<Game>('game/', TGame);

export default gameRepo;
