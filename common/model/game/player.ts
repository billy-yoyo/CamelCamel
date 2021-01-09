import T from 'tsplate';
import { PlayerColour, TPlayerColour } from './playerColour';
import { Resource, TResource } from './resource';

@T.constructor("id", "colour")
export class Player {
    @T.template(T.String)
    public id: string;

    @T.template(TPlayerColour)
    public colour: PlayerColour;

    constructor(id: string, colour: PlayerColour) {
        this.id = id;
        this.colour = colour;
    }
}

export const TPlayer = T.AutoClass(Player);
