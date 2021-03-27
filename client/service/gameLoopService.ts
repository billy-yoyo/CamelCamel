import { Hub } from "../util/hub";
import { shouldUpdate } from './networkService';

class GameLoop {
    private hub: Hub;
    private running: boolean = false;
    private abort: () => void = () => undefined;

    setHub(hub: Hub) {
        this.hub = hub;
    }

    private start() {
        this.running = true;

        const loop = async () => {
            if (!this.running) {
                return;
            }

            if (this.hub?.game) {
                const resp = await shouldUpdate(
                    this.hub.game.id,
                    this.hub.game.version,
                    (aborter) => { this.abort = aborter; }
                );
                if (!this.running) {
                    return;
                } else if (resp.data && resp.data.update) {
                    await this.hub.refreshGame();
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

    stop() {
        this.abort();
        this.running = false;
    }
}

export default new GameLoop();
