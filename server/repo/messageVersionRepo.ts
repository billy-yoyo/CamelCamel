import { redisStore } from '../store';
import T from 'tsplate';

const messageVersionRepo = redisStore.createTemplateStore<number>('message/', T.Int);

export default messageVersionRepo;
