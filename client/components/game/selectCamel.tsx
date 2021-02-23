import * as React from 'react';
import { Camel } from '../../../common/model/game/camel';
import CamelPiece from './camel';
import OptionOverlay from '../optionOverlay';
import { GameQuery } from '../../util/query';

interface SelectCamelProps {
    query: GameQuery<any>;
}

export default ({ query }: SelectCamelProps): JSX.Element => {
    const camels: Camel[] = query.data;

    const options = camels.map(camel => ({
        value: camel,
        render: (value: any) => <CamelPiece camel={value}></CamelPiece>
    }));

    const setOption = (camel: any) => {
        query.resolve(camel);
    };

    return (
        <OptionOverlay options={options} setOption={setOption}></OptionOverlay>
    )
};