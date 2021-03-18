import { Messages } from "../../common/model/response/messages";
import { Hub } from "../util/hub";
import { newMessages, shouldUpdate } from './networkService';

class MessageLoop {
    private hub: Hub;
    private running: boolean = false;

    setHub(hub: Hub) {
        this.hub = hub;
    }

    private start() {
        this.running = true;

        const loop = async () => {
            if (this.hub?.game) {
                const resp = await newMessages(this.hub.game.id,  this.hub?.messages?.version || 0);
                console.log(resp);
                if (resp.data) {
                    if (resp.data.messages.length) {
                        
                        const unsortedMessages = this.hub.messages ? this.hub.messages.messages.concat(resp.data.messages) : resp.data.messages;
                        const sortedMessages = unsortedMessages.sort((a, b) => b.timeSent - a.timeSent);

                        this.hub.setMessages({
                            messages: sortedMessages,
                            version: resp.data.version
                        });
                    }
                    setTimeout(loop, 100);
                } else {
                    console.warn(`encountered error when syncing game version`);
                    console.warn(resp.error);
                    setTimeout(loop, 1000);
                }
            } else {
                setTimeout(loop, 100);
            }
        };

        loop();
    }

    ensureRunning() {
        if (!this.running) {
            this.start();
        }
    }
}

export default new MessageLoop();
