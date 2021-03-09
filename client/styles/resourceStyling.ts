import { Resource } from "../../common/model/game/resource";

const ColourMap: {[key in Resource]: string} = {
    purple: 'purple',
    pink:  '#fc47ff',
    grey:  'grey',
    green:  'green',
    blue:  'blue',
    brown:  '#964B00',
    red:  'red',
    white:  'white'
};

const LetterMap: {[key in Resource]: [string, string]} = {
    purple: ['PU', 'white'],
    pink:  ['PK', 'black'], //
    grey:  ['GY', 'white'], //
    green:  ['GN', 'white'], //
    blue:  ['BL', 'white'], //
    brown:  ['BR', 'white'], //
    red:  ['RD', 'white'], //
    white:  ['WT', 'black'] //
};

export const resourceColour = (resource: Resource): string => {
    return ColourMap[resource];
};

export const resourceLetters = (resource: Resource): string => {
    return LetterMap[resource][0];
};

export const resourceLettersColour = (resource: Resource): string => {
    return LetterMap[resource][1];
}
