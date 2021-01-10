import redis from 'redis';
import { promisify } from 'util';
import { Template } from 'tsplate';

//const client = redis.createClient();
const clientGet = async (key: string): Promise<any> => {}; //promisify(client.get);
const clientSet = async (key: string, value: any) => {}; // promisify(client.set);

/*client.on("error", function(error) {
  console.error(error);
});*/

export class Store {
    async get<V>(key: string, template: Template<V, any>): Promise<V | undefined> {
        const value = await clientGet(key);

        const data = JSON.parse(value);
        if (template.valid(data)) {
            return template.toModel(data);
        } else {
            return undefined;
        }
    }

    async set<V>(key: string, value: V, template: Template<V, any>) {
        const data = template.toTransit(value);

        await clientSet(key, JSON.stringify(data));
    }

    createTemplateStore<V>(prefix: string, template: Template<V, any>): TemplateStore<V> {
        return new TemplateStore(this, template, prefix);
    }
}

export class TemplateStore<V> {
    private store: Store;
    private template: Template<V, any>;
    private prefix: string;

    constructor(store: Store, template: Template<V, any>, prefix: string) {
        this.store = store;
        this.template = template;
        this.prefix = prefix;
    }

    async get(key: string): Promise<V | undefined> {
        return await this.store.get(this.prefix + key, this.template);
    }

    async set(key: string, value: V) {
        return await this.store.set(this.prefix + key, value, this.template);
    }
}

const store = new Store();
export default store;