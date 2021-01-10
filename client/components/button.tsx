import * as React from 'react';
import './button.less';

type Styles = 'primary' | 'secondary';

interface ButtonProps {
    style?: Styles;
    title: string;
    onclick?: () => void;
}

export default ({ style, title, onclick }: ButtonProps): JSX.Element => {
    const classes = ['button', style || 'primary']

    return (
        <div className={classes.join(' ')} onClick={onclick}>
            {title}
        </div>
    )
};