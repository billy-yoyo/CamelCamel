import { Message, TMessage } from '../../common/model/game/message';
import { redisStore } from '../store';
import T from 'tsplate';

const messageRepo = redisStore.createTemplateStore<Message>('message/', TMessage);

export default messageRepo;
