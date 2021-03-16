import * as React from 'react';
import { Camel } from '../../../common/model/game/camel';
import CamelPiece from '../../images/camelPiece';
import './camel.less';
import { resourceColour, resourceLetters, resourceLettersColour } from '../../styles/resourceStyling';

interface CamelProps {
    camel: Camel
}

export default ({ camel }: CamelProps): JSX.Element => {
    const carryingClasses = ["carrying"];
    if (camel.isResourceSafe) {
        carryingClasses.push("safe");
    }
    const carryingClass = carryingClasses.join(" ");

    return (
        <div className="camel-piece">
            <CamelPiece fill={camel.colour} stroke="black"></CamelPiece>
            {
                camel.carrying ? (
                    <div className={carryingClass} style={{backgroundColor: resourceColour(camel.carrying), borderColor: resourceLettersColour(camel.carrying)}}></div>
                ) : null
            }
        </div>
    )
}