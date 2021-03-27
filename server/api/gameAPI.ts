import * as express from 'express';
import gameService from '../service/gameService';
import messageService from '../service/messageService';
import { TGame } from '../../common/model/game/game';
import { TPlayer } from '../../common/model/game/player';
import errors from '../errors';
import { TAction } from '../../common/model/game/action';
import safeHandler from './helper/safeHandler';
import asyncRepeat from '../util/asyncRepeat';
import { TMessages } from '../../common/model/response/messages';
import { Message, TMessage } from '../../common/model/game/message';
import { TPlayerType } from '../../common/model/game/playerType';

const router = express.Router();

function asInt(x: string): number {
    try {
        return parseInt(x, 10);
    } catch {
        return null;
    }
}

router.get('/:gameId', safeHandler(async (req, res) => {
    if (!req.params.gameId) {
        return errors.badRequest(res, 'Must specify game id');
    }

    const game = await gameService.getGame(req.params.gameId);

    if (!game) {
        return errors.notFound(res, `No game with id ${req.params.gameId} found`);
    }

    res.json(TGame.toTransit(game));
}));

router.post('/:gameId', safeHandler(async (req, res) => {
    const game = await gameService.createGame(req.params.gameId);

    if (!game) {
        return errors.badRequest(res, `Game with id ${req.params.gameId} already exists`);
    }

    res.json(TGame.toTransit(game));
}));

router.post('/:gameId/join', safeHandler(async (req, res) => {
    if (!TPlayer.valid(req.body)) {
        return errors.badRequest(res, 'Invalid player object');
    }

    const player = TPlayer.toModel(req.body);
    const game = await gameService.getGame(req.params.gameId);

    if (!game) {
        return errors.notFound(res, `No game with id ${req.params.gameId} found`);
    }

    const response = await gameService.joinGame(game, player);

    if (!response) {
        return res.json(TGame.toTransit(game));
    } else {
        return errors.badRequest(res, response);
    }
}));

router.post('/:gameId/start', safeHandler(async (req, res) => {
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
}));

router.post('/:gameId/restart', safeHandler(async (req, res) => {
    const result = await gameService.restartGame(req.params.gameId);

    if (!result) {
        return errors.notFound(res, `Game with id ${req.params.gameId} cannot be restarted since it hasn't finished`);
    }

    return res.json({ success: true });
}));

router.post('/:gameId/action', safeHandler(async (req, res) => {
    const game = await gameService.getGame(req.params.gameId);

    if (!game) {
        return errors.notFound(res, `No game with id ${req.params.gameId} found`);
    }

    const player = game.players.find(p => p.id === req.query.playerId);

    if (!player) {
        return errors.notFound(res, `No player with id ${req.query.playerId} is in game ${req.params.gameId}`);
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
}));

router.post('/:gameId/undo', safeHandler(async (req, res) => {
    const game = await gameService.getGame(req.params.gameId);

    if (!game) {
        return errors.notFound(res, `No game with id ${req.params.gameId} found`);
    }

    const player = game.players.find(p => p.id === req.query.playerId);

    if (!player) {
        return errors.notFound(res, `No player with id ${req.query.playerId} is in game ${req.params.gameId}`);
    }

    if (game.state.turn.playerId !== player.id) {
        return errors.badRequest(res, `It's not ${player.id}'s turn`);
    }

    const reverted = await gameService.revertGameState(game);

    return res.json({ success: reverted });
}));

router.post('/:gameId/end', safeHandler(async (req, res) => {
    const game = await gameService.getGame(req.params.gameId);

    if (!game) {
        return errors.notFound(res, `No game with id ${req.params.gameId} found`);
    }

    const player = game.players.find(p => p.id === req.query.playerId);

    if (!player) {
        return errors.notFound(res, `No player with id ${req.query.playerId} is in game ${req.params.gameId}`);
    }

    const result = await gameService.endTurn(game, player);

    if (result) {
        return errors.badRequest(res, result);
    }

    return res.json({ success: true });
}));

router.get('/:gameId/updated', safeHandler(async (req, res) => {
    const version = asInt(req.query.version as string);

    if (version === null) {
        return errors.badRequest(res, `Invalid or missing version ${req.query.version}`);
    }

    const game = await gameService.getGame(req.params.gameId);

    if (!game) {
        return errors.notFound(res, `No game with id ${req.params.gameId} found`);
    }

    if (game.version !== version) {
        return res.json({ update: true });
    }

    // check for the game being updated once a second, for up to a minute
    const updatedGame = await asyncRepeat(async () => {
        const checkGame = await gameService.getGame(req.params.gameId);

        if (checkGame.version !== version) {
            return checkGame;
        }
    }, 200, 300);

    if (updatedGame) {
        return res.json({ update: updatedGame.version !== version });
    } else {
        return res.json({ update: false });
    }
}));

router.get('/:gameId/messages/new', safeHandler(async (req, res) => {
    const version = asInt(req.query.version as string);

    if (version === null) {
        return errors.badRequest(res, `Invalid or missing version ${req.query.version}`);
    }

    const newMessages = await asyncRepeat(async () => {
        const curVersion = await messageService.getLatestVersion(req.params.gameId);

        if (curVersion > version) {
            return await messageService.getMessages(req.params.gameId, version, curVersion);
        }
    }, 100, 600) || [];

    const latestVersion = await messageService.getLatestVersion(req.params.gameId);

    return res.json(TMessages.toTransit({
        messages: newMessages,
        version: latestVersion
    }));
}));

router.post('/:gameId/messages', safeHandler(async (req, res) => {
    if (!TMessage.valid(req.body)) {
        return errors.badRequest(res, 'Invalid message object');
    }

    const message = TMessage.toModel(req.body);
    const game = await gameService.getGame(req.params.gameId);

    if (!game) {
        return errors.notFound(res, `No game with id ${req.params.gameId} found`);
    }

    await messageService.addMessage(req.params.gameId, message);

    return res.json({ success: true });
}));

router.post('/:gameId/ai', safeHandler(async (req, res) => {
    const game = await gameService.getGame(req.params.gameId);

    if (!game) {
        return errors.notFound(res, `No game with id ${req.params.gameId} found`);
    }

    const result = await gameService.addAiPlayer(game);

    if (result) {
        return errors.badRequest(res, result);
    }

    return res.json({ success: true });
}));

router.delete('/:gameId/ai', safeHandler(async (req, res) => {
    const game = await gameService.getGame(req.params.gameId);

    if (!game) {
        return errors.notFound(res, `No game with id ${req.params.gameId} found`);
    }

    const player = game.players.find(p => p.id === req.query.playerId);

    if (!player) {
        return errors.notFound(res, `No player with id ${req.query.playerId} is in game ${req.params.gameId}`);
    }

    const result = await gameService.kickAiPlayer(game, player);

    if (result) {
        return errors.badRequest(res, result);
    }

    return res.json({ success: true });
}));

router.post('/:gameId/ai/difficulty', safeHandler(async (req, res) => {
    const game = await gameService.getGame(req.params.gameId);

    if (!game) {
        return errors.notFound(res, `No game with id ${req.params.gameId} found`);
    }

    const player = game.players.find(p => p.id === req.query.playerId);

    if (!player) {
        return errors.notFound(res, `No player with id ${req.query.playerId} is in game ${req.params.gameId}`);
    }

    if (!TPlayerType.valid(req.query.difficulty)) {
        return errors.badRequest(res, `${req.query.difficulty} is not a valid player type`);
    }

    const difficulty = TPlayerType.toModel(req.query.difficulty);

    const result = await gameService.setAiDifficulty(game, player, difficulty);

    if (result) {
        return errors.badRequest(res, result);
    }

    return res.json({ success: true });
}));

export default router;