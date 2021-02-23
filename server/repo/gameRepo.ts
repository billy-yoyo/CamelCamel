import { Game, TGame } from '../../common/model/game/game';
import { redisStore } from '../store';

const gameRepo = redisStore.createTemplateStore<Game>('game/', TGame);

export default gameRepo;
