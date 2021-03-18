import * as React from 'react';
import './textbox.less';

interface TextboxProps {
    title?: string;
    value?: string;
    uppercase?: boolean;
    setValue?: (value: string) => void;
    validator?: (value: string) => string;
    className?: string;
    onSubmit?: () => void;
    onFocusChange?: (focused: boolean) => void;
}

export default ({ title, value, uppercase, setValue, validator, className, onSubmit, onFocusChange }: TextboxProps): JSX.Element => {
    // don't validate an empty string
    const error = (value && validator) ? validator(value) : undefined;
    const transformValue = (v: string): string => {
        if (uppercase) {
            return v ? v.toUpperCase() : '';
        } else {
            return v;
        }
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setValue('');
            onSubmit();
        }
    };

    return (
        <div className={"textbox-container" + (error ? ' error' : '') + (className ? ` ${className}` : '')}>
            { title &&
                <div className="textbox-title">
                    {title}
                </div>
            }
            <input type="text"
                className={"textbox" + (uppercase ? ' uppercase' : '')}
                value={value}
                placeholder={title}
                onChange={e => setValue && setValue(transformValue(e.target.value))}
                onKeyDown={onSubmit ? onKeyDown : undefined}
                onFocus={() => onFocusChange(true)}
                onBlur={() => onFocusChange(false)} />
             { error &&
                    <div className="textbox-error">
                        {error}
                    </div>
                }
        </div>
    )
};