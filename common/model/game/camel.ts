import T from "tsplate";
import { PlayerColour, TPlayerColour } from "./playerColour";
import { Resource, TResource } from "./resource";

@T.constructor("colour", "carrying", "isResourceSafe")
export class Camel {
    @T.template(TPlayerColour)
    public colour: PlayerColour;

    @T.template(TResource)
    public carrying: Resource;

    @T.template(T.Boolean)
    public isResourceSafe: boolean;

    constructor(colour: PlayerColour, carrying: Resource, isResourceSafe: boolean) {
        this.colour = colour;
        this.carrying = carrying;
        this.isResourceSafe = isResourceSafe;
    }
}

export const TCamel = T.AutoClass(Camel);
