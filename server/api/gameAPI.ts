import * as express from 'express';
import gameService from '../service/gameService';
import { TGame } from '../../common/model/game/game';
import { TPlayer } from '../../common/model/game/player';
import errors from '../errors';
import { TAction } from '../../common/model/game/action';

const router = express.Router();

function asInt(x: string): number {
    try {
        return parseInt(x);
    } catch {
        return null;
    }
}

router.get('/:gameId', async (req, res) => {
    if (!req.params.gameId) {
        return errors.badRequest(res, 'Must specify game id');
    }

    const game = await gameService.getGame(req.params.gameId);

    if (!game) {
        return errors.notFound(res, `No game with id ${req.params.gameId} found`);
    }

    res.json(TGame.toTransit(game));
});

router.post('/create', async (req, res) => {
    const game = await gameService.createGame();

    res.json(TGame.toTransit(game));
});

router.post('/:gameId/join', async (req, res) => {
    if (!TPlayer.valid(req.body)) {
        return errors.badRequest(res, 'Invalid player object');
    }

    const player = TPlayer.toModel(req.body);
    const game = await gameService.getGame(req.params.gameId);

    if (!game) {
        return errors.notFound(res, `No game with id ${req.params.gameId} found`);
    }

    const joined = await gameService.joinGame(game, player);

    if (joined) {
        return res.json({ success: true });
    } else {
        return errors.badRequest(res, `Player with that id or colour already exists, or too many players are already in the game`);
    }
});

router.post('/:gameId/start', async (req, res) => {
    const game = await gameService.getGame(req.params.gameId);

    if (!game) {
        return errors.notFound(res, `No game with id ${req.params.gameId} found`);
    }

    const started = await gameService.startGame(game);

    if (started) {
        return res.json({ success: true });
    } else {
        return errors.badRequest(res, `Cannot start a finished game, or cannot start a game with no players`);
    }
});

router.post('/:gameId/action/:playerId', async (req, res) => {
    const game = await gameService.getGame(req.params.gameId);

    if (!game) {
        return errors.notFound(res, `No game with id ${req.params.gameId} found`);
    }

    const player = game.players.find(p => p.id === req.params.playerId);

    if (!player) {
        return errors.notFound(res, `No player with id ${req.params.playerId} is in game ${req.params.gameId}`);
    }

    if (!TAction.valid(req.body)) {
        return errors.badRequest(res, 'Invalid action object');
    }

    const action = TAction.toModel(req.body);
    const result = await gameService.playAction(game, player, action);

    if (typeof result === 'string') {
        return errors.badRequest(res, result);
    }

    return res.json({ remainingActions: result });
});

router.get('/:gameId/updated', async (req, res) => {
    const version = asInt(req.query.version as string);

    if (version === null) {
        return errors.badRequest(res, `Invalid or missing version ${req.query.version}`);
    }

    const game = await gameService.getGame(req.params.gameId);

    if (!game) {
        return errors.notFound(res, `No game with id ${req.params.gameId} found`);
    }
    
    return res.json({ update: game.version !== version });
});

export default router;