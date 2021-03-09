import T from 'tsplate';
import { GameState, TGameState } from '../../common/model/game/gameState';
import { redisStore } from '../store';

const gameHistoryRepo = redisStore.createTemplateStore<GameState[]>('gameStateHistory/', T.Array(TGameState));

export default gameHistoryRepo;
