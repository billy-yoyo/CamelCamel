import T from 'tsplate';
import { Resource, TResource } from './resource';

@T.constructor("playerId", "resource", "money")
export class Delivery {
    @T.template(T.String)
    public playerId: string;

    @T.template(T.Optional(TResource))
    public resource: Resource;

    @T.template(T.Optional(T.Int))
    public money: number;

    constructor(playerId: string, resource: Resource, money: number) {
        this.playerId = playerId;
        this.resource = resource;
        this.money = money;
    }
}

export const TDelivery = T.AutoClass(Delivery);
