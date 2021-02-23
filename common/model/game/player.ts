import T from 'tsplate';
import { GameState } from './gameState';
import { PlayerColour, TPlayerColour } from './playerColour';
import { Resource } from './resource';

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
