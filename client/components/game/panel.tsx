import * as React from 'react';
import './panel.less';

interface PanelProps {
    title?: string;
    className?: string;
}

const Panel: React.FunctionComponent<PanelProps> = ({ title, children, className }): JSX.Element => {
    return (
        <div className={"panel" + (className ? ` ${className}` : '')}>
            { title &&
                <div className="title">
                    {title}
                </div>
            }
            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default Panel;