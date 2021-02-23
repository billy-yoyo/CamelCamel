import Store from './store';
import { Template } from 'tsplate';

export default class TemplateStore<V> {
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
