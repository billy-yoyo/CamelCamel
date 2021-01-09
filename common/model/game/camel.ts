import T from "tsplate";
import { PlayerColour, TPlayerColour } from "./playerColour";
import { Resource, TResource } from "./resource";

@T.constructor("colour", "carrying")
export class Camel {
    @T.template(TPlayerColour)
    public colour: PlayerColour;

    @T.template(TResource)
    public carrying: Resource;

    constructor(colour: PlayerColour, carrying: Resource) {
        this.colour = colour;
        this.carrying = carrying;
    }
}

export const TCamel = T.AutoClass(Camel);
