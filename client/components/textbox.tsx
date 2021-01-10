import * as React from 'react';
import './textbox.less';

interface TextboxProps {
    title: string;
}

export default ({ title }: TextboxProps): JSX.Element => {

    return (
        <div className="textbox-container">
            <div className="textbox-title">{title}</div>
            <input type="text" className="textbox" placeholder={title}></input>
        </div>
    )
};