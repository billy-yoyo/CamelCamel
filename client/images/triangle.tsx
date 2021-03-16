import * as React from 'react';

interface TriangleProps {
    fill?: string;
    stroke?: string;
    strokeWidth?: string;
}

export default ({ fill, stroke, strokeWidth }: TriangleProps): JSX.Element => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" version="1.0">
            <polygon points="50,16 85,85 15,85 50,16" fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>
        </svg>
    )
};