import * as React from 'react';
import './button.less';

type Styles = 'primary' | 'secondary';

interface ButtonProps {
    style?: Styles;
    title: string;
    onclick?: () => void;
    disabled?: boolean;
}

export default ({ style, title, onclick, disabled }: ButtonProps): JSX.Element => {
    const classes = ['button', style || 'primary'];
    if (disabled) {
        classes.push('disabled');
    }

    const guardedOnClick = () => {
        if (!disabled) {
            onclick();
        }
    };

    return (
        <div className={classes.join(' ')} onClick={guardedOnClick}>
            {title}
        </div>
    )
};