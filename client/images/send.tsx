import * as React from 'react';

interface SendProps {
    size: string;
    colour: string;
}

export default ({ size, colour }: SendProps): JSX.Element => {

    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 0 24 24" width={size}><path d="M0 0h24v24H0z" fill="none"/><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill={colour}/></svg>
    )
};
