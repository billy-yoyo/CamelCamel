import * as React from 'react';
import './textbox.less';

interface TextboxProps {

}

export default ({}: TextboxProps): JSX.Element => {

    return (
        <input type="text" className="textbox"></input>
    )
};