import redis from 'redis';
import { promisify } from 'util';
import { Template } from 'tsplate';
import TemplateStore from './templateStore';
import Store from './store';

const client = redis.createClient();
const clientGet = promisify(client.get).bind(client);
const clientSet = promisify(client.set).bind(client);
const clientDel = promisify(client.del).bind(client);

client.on("error", (error) => {
  console.error(error);
});

export class RedisStore implements Store {
    async get<V>(key: string, template: Template<V, any>): Promise<V | undefined> {
        const value = await clientGet(key);

        const data = JSON.parse(value);
        if (data === null || data === undefined) {
            return data;
        } else if (template.valid(data)) {
            return template.toModel(data);
        } else {
            console.warn(`data ${value} failed to validate, defaulting to undefined`)
            return undefined;
        }
    }

    async set<V>(key: string, value: V, template: Template<V, any>) {
        if (value === undefined) {
            await clientDel(key);
        } else {
            const data = value === undefined ? value : template.toTransit(value);

            await clientSet(key, JSON.stringify(data));
        }
    }

    async delete(key: string) {
        await clientDel(key);
    }

    createTemplateStore<V>(prefix: string, template: Template<V, any>): TemplateStore<V> {
        return new TemplateStore(this, template, prefix);
    }
}

const store = new RedisStore();
export default store;