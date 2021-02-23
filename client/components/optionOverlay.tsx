import * as React from 'react';
import './optionOverlay.less';

interface Option {
    render: (value: any) => JSX.Element;
    value: any;
}

interface OptionProps {
    render: (value: any) => JSX.Element;
    value: any;
    key: string;
    setOption: (value: any) => void;
}

interface OptionOverlayProps {
    options: Option[];
    setOption: (value: any) => void;
}

const Option = ({ render, value, setOption }: OptionProps): JSX.Element => {
    const onClick = () => setOption(value);

    return (
        <div className="option" onClick={onClick}>
            { render(value) }
        </div>
    )
};

export default ({ options, setOption }: OptionOverlayProps): JSX.Element => {
    return (
        <div className="option-overlay">
            <div className="screen"></div>
            <div className="options">
                {
                    options.map(
                        (option, index) => (
                            <Option render={option.render} value={option.value} key={index.toString()} setOption={setOption}></Option>
                        )
                    )
                }
            </div>
        </div>
    )
};