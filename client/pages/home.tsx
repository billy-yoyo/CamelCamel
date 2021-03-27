import * as React from 'react';
import { Page } from '../../common/model/client/page';
import Button from '../components/button';
import Textbox from '../components/textbox';
import ColourPicker from '../components/colourPicker';
import Camel from '../images/camel';
import "./home.less";
import useLocalStorage from '../util/useLocalStorage';
import T from 'tsplate';
import * as networkService from '../service/networkService';
import { Player } from '../../common/model/game/player';
import { PlayerColour } from '../../common/model/game/playerColour';
import { storeGame } from '../repo/gameRepo';
import { storePlayer } from '../repo/playerRepo';
import { storeMessages } from '../repo/messageRepo';
import gameLoop from '../service/gameLoopService';
import messageLoop from '../service/messageLoopService';

interface HomeProps {
    pageData: any;
    setPage: (page: Page, pageData?: any) => void;
}

interface JourneyProps {
    setPage: (page: Page, pageData?: any) => void;
    gameName: string;
    player: Player;
}

const attemptCreateGame = async ({ setPage, gameName, player }: JourneyProps) => {
    setPage('loading');

    const gameResponse = await networkService.createGame(gameName);
    if (gameResponse.error) {
        setPage('home', { error: gameResponse.error.message });
        return;
    }

    await attemptJoinGame({ setPage, gameName, player }, true);
};

const attemptJoinGame = async ({ setPage, gameName, player }: JourneyProps, afterCreation?: boolean) => {
    setPage('loading');

    const joinResponse = await networkService.joinGame(gameName, player);
    if (joinResponse.error) {
        setPage('home', { error: joinResponse.error.message });
        return;
    }

    storeGame(joinResponse.data);
    storePlayer(player);
    storeMessages({ messages: [], version: 0 });

    setPage('game');
};

const GameNamePattern = /^[A-Z0-9_-]*$/g;
const validateGameName = (gameName: string): string => {
    if (!gameName) {
        return undefined;
    } if (gameName.length < 4) {
        return 'Game name must be at least 4 characters';
    } else if (!gameName.match(GameNamePattern)) {
        return 'Game name can only contain letters, numbers, _ and -'
    }

    return undefined;
};

const validatePlayerName = (playerName: string): string => {
    if (!playerName) {
        return undefined;
    } else if (playerName.length < 1) {
        return 'Player name must be at least one character long';
    } else if (playerName.length > 12) {
        return 'Player name cannot be longer than 12 characters';
    }

    return undefined;
};

const gameAndPlayerNamesAreValid = (gameName: string, playerName: string): boolean => {
    return !validatePlayerName(gameName) && !validatePlayerName(playerName);
}

export default ({ setPage, pageData }: HomeProps): JSX.Element => {
    const [gameName, setGameName] = useLocalStorage('gameName', T.String);
    const [playerName, setPlayerName] = useLocalStorage('playerName', T.String);
    const [playerColour, setPlayerColour] = useLocalStorage('playerColour', T.String, 'black');
    const errorMessage = pageData && pageData.error;
    const namesValid = gameAndPlayerNamesAreValid(gameName, playerName);

    const colours: PlayerColour[] = ['black', 'blue', 'green', 'yellow'];

    const createJourneyProps = (): JourneyProps => ({ setPage, gameName, player: new Player(playerName, playerColour as PlayerColour, 'human') });
    const withJourneyProps = (func: (props: JourneyProps) => any) => (() => func(createJourneyProps()))
    const validatedWithJourneyProps = (func: (props: JourneyProps) => any) => {
        if (gameAndPlayerNamesAreValid(gameName, playerName)) {
            return withJourneyProps(func);
        }
    };

    const onCreateGame = validatedWithJourneyProps(attemptCreateGame);
    const onJoinGame = validatedWithJourneyProps(attemptJoinGame);

    gameLoop.stop();
    messageLoop.stop();

    return (
        <div className="home">
            <div className="home-logo">
                <Camel colour='#44b' width="300px"></Camel>
            </div>
            <div className="game-name">
                <Textbox title="Game" value={gameName} setValue={setGameName} validator={validateGameName} uppercase={true}></Textbox>
            </div>
            <div className="player-name">
                <Textbox title="Player" value={playerName} setValue={setPlayerName} validator={validatePlayerName}></Textbox>
            </div>
            <div className="player-colour">
                <ColourPicker colours={colours} colour={playerColour} setColour={setPlayerColour}></ColourPicker>
            </div>
            {
                errorMessage && ( <div className="error-message">{errorMessage}</div> )
            }
            <div className="create-game">
                <Button title="Create Game" onclick={onCreateGame} disabled={!namesValid} alwaysBig={true}></Button>
            </div>
            <div className="join-game">
                <Button title="Join Game" onclick={onJoinGame} disabled={!namesValid} alwaysBig={true}></Button>
            </div>

        </div>
    )
};