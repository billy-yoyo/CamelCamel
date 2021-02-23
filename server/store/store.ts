import { Template } from 'tsplate';

export default interface Store {
    get<V>(key: string, template: Template<V, any>): Promise<V | undefined>;
    set<V>(key: string, value: V, template: Template<V, any>): Promise<void>;
}
