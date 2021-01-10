import * as React from 'react';

interface OctagonProps {
    width: string;
    height: string;
    fill: string;
    stroke: string;
}

export default ({ width, height, fill, stroke }: OctagonProps) => {
    return (
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} fill={fill} stroke={stroke} viewBox="0 0 73.935 73.935">
        <g>
            <g>
                <path d="M52.279,73.935H21.656L0,52.279V21.655L21.655,0h30.625l21.655,21.655v30.625L52.279,73.935z M22.898,70.935h28.139    l19.898-19.897v-28.14L51.037,2.999H22.898L3,22.897v28.14L22.898,70.935z"/>
            </g>
        </g>
        </svg>
    )
}