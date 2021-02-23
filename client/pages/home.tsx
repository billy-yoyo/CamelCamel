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
import { haltingSequence } from '../util/asyncHelper';
import { storeGame } from '../repo/gameRepo';
import { storePlayer } from '../repo/playerRepo';

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

    setPage('game');
};

export default ({ setPage, pageData }: HomeProps): JSX.Element => {
    const [gameName, setGameName] = useLocalStorage('gameName', T.String);
    const [playerName, setPlayerName] = useLocalStorage('playerName', T.String);
    const [playerColour, setPlayerColour] = useLocalStorage('playerColour', T.String, 'black');
    const errorMessage = pageData && pageData.error;

    const colours: PlayerColour[] = ['black', 'blue', 'green', 'yellow'];

    const createJourneyProps = (): JourneyProps => ({ setPage, gameName, player: new Player(playerName, playerColour as PlayerColour) });
    const withJourneyProps = (func: (props: JourneyProps) => any) => (() => func(createJourneyProps()))

    const onCreateGame = withJourneyProps(attemptCreateGame);
    const onJoinGame = withJourneyProps(attemptJoinGame);

    return (
        <div className="home">
            <Camel colour='#44b' width="300px"></Camel>
            <div className="game-name">
                <Textbox title="Game" value={gameName} setValue={setGameName}></Textbox>
            </div>
            <div className="player-name">
                <Textbox title="Player" value={playerName} setValue={setPlayerName}></Textbox>
            </div>
            <div className="player-colour">
                <ColourPicker colours={colours} colour={playerColour} setColour={setPlayerColour}></ColourPicker>
            </div>
            {
                errorMessage && ( <div className="error-message">{errorMessage}</div> )
            }
            <div className="create-game">
                <Button title="Create Game" onclick={onCreateGame}></Button>
            </div>
            <div className="join-game">
                <Button title="Join Game" onclick={onJoinGame}></Button>
            </div>

        </div>
    )
};