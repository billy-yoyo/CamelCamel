import * as React from 'react';
import './textbox.less';

interface TextboxProps {
    title: string;
    value?: string;
    uppercase?: boolean;
    setValue?: (value: string) => void;
    validator?: (value: string) => string;
}

export default ({ title, value, uppercase, setValue, validator }: TextboxProps): JSX.Element => {
    // don't validate an empty string
    const error = (value && validator) ? validator(value) : undefined;
    const transformValue = (v: string): string => {
        if (uppercase) {
            return v ? v.toUpperCase() : '';
        } else {
            return '';
        }
    };

    return (
        <div className={"textbox-container" + (error ? ' error' : '')}>
            <div className="textbox-title">
                {title}
            </div>
            <input type="text"
                className={"textbox" + (uppercase ? ' uppercase' : '')}
                value={value}
                placeholder={title}
                onChange={e => setValue && setValue(transformValue(e.target.value))} />
             { error &&
                    <div className="textbox-error">
                        {error}
                    </div>
                }
        </div>
    )
};