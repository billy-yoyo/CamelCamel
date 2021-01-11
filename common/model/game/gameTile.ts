import T from 'tsplate';
import { Camel, TCamel } from './camel';
import { Resource, TResource } from './resource';

@T.constructor("camels", "resource", "deliver", "spawnId", "money")
export class GameTile {
    @T.template(T.Array(TCamel))
    public camels: Camel[];

    @T.template(T.Optional(TResource))
    public resource: Resource;

    @T.template(T.Optional(TResource))
    public deliver: Resource;

    @T.template(T.Int)
    public spawnId: number;

    @T.template(T.Int)
    public money: number;

    constructor(camels: Camel[], resource: Resource, deliver: Resource, spawnId: number, money: number) {
        this.camels = camels;
        this.resource = resource;
        this.deliver = deliver;
        this.spawnId = spawnId;
        this.money = money;
    }
}

export const TGameTile = T.AutoClass(GameTile);
