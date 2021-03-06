import * as React from 'react';

interface UndoIconProps {
    width: string;
    height: string;
    fill: string;
}

export default ({ width, height, fill }: UndoIconProps): JSX.Element => {

    return (
        <svg height={height} width={width}  fill={fill} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 89.231 100" enableBackground="new 0 0 89.231 100" xmlSpace="preserve"><path d="M14.652,64.026c-0.603-2.09-1-4.267-1.15-6.511H0c0.18,3.858,0.86,7.586,1.962,11.13L14.652,64.026z"></path><path d="M14.332,88.192l8.684-10.35c-2.899-2.792-5.273-6.127-6.926-9.857L3.402,72.604C5.9,78.563,9.655,83.87,14.332,88.192z"></path><path d="M42.483,86.499c-6.051-0.409-11.626-2.559-16.245-5.943l-8.681,10.346c6.985,5.336,15.582,8.661,24.926,9.099V86.499z"></path><path d="M44.589,10.768V0L14.266,17.506l30.323,17.506V24.245c17.186,0,31.166,13.98,31.166,31.165  c0,16.477-12.854,29.999-29.061,31.087v13.502C70.337,98.896,89.231,79.32,89.231,55.41C89.231,30.794,69.205,10.768,44.589,10.768z  "></path></svg>
    )
};