import { Message } from "../../common/model/game/message";
import messageRepo from '../repo/messageRepo';
import messageVersionRepo from '../repo/messageVersionRepo';

export class MessageService {
    async getLatestVersion(gameId: string): Promise<number> {
        const version = await messageVersionRepo.get(gameId);
        return version || 0;
    }

    async addMessage(gameId: string, message: Message) {
        const version = await this.getLatestVersion(gameId);
        await messageVersionRepo.set(gameId, version + 1);
        await messageRepo.set(`${gameId}/${version}`, message);
    }

    async getMessages(gameId: string, from: number, to: number): Promise<Message[]> {
        const messages: Message[] = [];
        for (let i = from; i < to; i++) {
            const message = await messageRepo.get(`${gameId}/${i}`);
            messages.push(message);
        }
        return messages;
    }

    async deleteAllMessages(gameId: string) {
        const version = await this.getLatestVersion(gameId);
        await messageVersionRepo.delete(gameId);
        for (let i = 0; i < version; i++) {
            try {
                await messageRepo.delete(`${gameId}/${i}`);
            } catch {
                // ignore failed deletes
            }
        }
    }
}

const messageService = new MessageService();
export default messageService;