import T from 'tsplate';
import { GameState } from './gameState';
import { PlayerColour, TPlayerColour } from './playerColour';
import { PlayerType, TPlayerType } from './playerType';

@T.constructor("id", "colour", "type")
export class Player {
    @T.template(T.String)
    public id: string;

    @T.template(TPlayerColour)
    public colour: PlayerColour;

    @T.template(TPlayerType)
    public type: PlayerType;

    constructor(id: string, colour: PlayerColour, type: PlayerType) {
        this.id = id;
        this.colour = colour;
        this.type = type;
    }

    get isHuman(): boolean {
        return this.type === 'human';
    }

    calculateScore(state: GameState) {
        return state.deliveries.filter(
            d => d.playerId === this.id
        ).reduce(
            (score, d) => {
                let newScore = score;
                if (d.money) {
                    newScore += d.money;
                }
                if (d.resource) {
                    if (d.resource === 'green' || d.resource === 'pink' || d.resource === 'grey' || d.resource === 'purple') {
                        newScore += 6;
                    } else {
                        newScore += 3;
                    }
                }
                return newScore;
            }
        , 0);
    }
}

export const TPlayer = T.AutoClass(Player);
