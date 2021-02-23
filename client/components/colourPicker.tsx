import * as React from 'react';
import './colourPicker.less';

interface ColourPickerProps {
    colours: string[];
    colour: string;
    setColour: (colour: string) => void;
}

interface ColourChoice {
    colour: string;
    selectedColour: string;
    setSelectedColour: (colour: string) => void;
}

const ColourChoice = ({ colour, selectedColour, setSelectedColour }: ColourChoice): JSX.Element => {
    const onClick = () => setSelectedColour(colour)

    return (
        <div className={"colour-choice" + (colour === selectedColour ? ' selected' : '')}
            style={{backgroundColor: colour}}
            onClick={onClick}
        ></div>
    )
};

export default ({ colours, colour, setColour }: ColourPickerProps): JSX.Element => {
    return (
        <div className="colour-picker">
            {
                colours.map(c => (
                    <ColourChoice colour={c} selectedColour={colour} setSelectedColour={setColour} key={c}></ColourChoice>
                ))
            }
        </div>
    )
};