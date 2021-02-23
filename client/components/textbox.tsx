import * as React from 'react';
import './textbox.less';

interface TextboxProps {
    title: string;
    value?: string;
    setValue?: (value: string) => void;
}

export default ({ title, value, setValue }: TextboxProps): JSX.Element => {
    return (
        <div className="textbox-container">
            <div className="textbox-title">{title}</div>
            <input type="text" className="textbox" value={value} placeholder={title} onChange={e => setValue && setValue(e.target.value)}></input>
        </div>
    )
};