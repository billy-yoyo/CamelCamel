import T, { Template, ModelType } from "tsplate";
import { ActionType, TActionType } from "./actionType";
import { TPlayerColour } from "./playerColour";
import { TResource } from "./resource";


const TPoint = T.Object({x: T.Int, y: T.Int});

export const TPickupData = T.Object({tile: TPoint});
export type PickupData = ModelType<typeof TPickupData>;

export const TPlaceData = T.Object({tile: TPoint});
export type PlaceData = ModelType<typeof TPlaceData>;

export const TMoveData = T.Object({from: TPoint, to: TPoint});
export type MoveData = ModelType<typeof TMoveData>;

export const TTransportData = T.Object({from: TPoint, to: TPoint, resource: TResource});
export type TransportData = ModelType<typeof TTransportData>;

export const TStealData = T.Object({tile: TPoint, targetColour: TPlayerColour, targetResource: TResource});
export type StealData = ModelType<typeof TStealData>;

export type ActionData = PickupData | PlaceData | MoveData | TransportData;

const TAny: Template<any, any> = {
    valid: (o: any): o is any => true,
    toModel: (o) => o,
    toTransit: (o) => o
};

@T.constructor("type", "data")
export class Action {
    @T.template(TActionType)
    public type: ActionType;

    @T.template(TAny)
    public data: ActionData;

    constructor(type: ActionType, data: ActionData) {
        this.type = type;
        this.data = data;
    }
}

export const TAction = T.AutoClass(Action);
