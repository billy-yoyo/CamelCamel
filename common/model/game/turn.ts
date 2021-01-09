import T from 'tsplate';
import { Action, TAction } from './action';

@T.constructor("playerId", "remainingActions", "actions")
export class Turn {
    @T.template(T.String)
    public playerId: string;

    @T.template(T.Int)
    public remainingActions: number;

    @T.template(T.Array(TAction))
    public actions: Action[];

    constructor(playerId: string, remainingActions: number, actions: Action[]) {
        this.playerId = playerId;
        this.remainingActions = remainingActions;
        this.actions = actions;
    }
}

export const TTurn = T.AutoClass(Turn);
