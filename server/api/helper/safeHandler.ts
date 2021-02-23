import internalServerError from '../../errors/internalServerError';
import * as express from 'express';

type RequestHandler = (req: express.Request, res: express.Response) => Promise<any>;

export default (handler: RequestHandler): RequestHandler => {
    return async (req, res) => {
        console.info(`handling request ${req.path}`);
        try {
            const result = await handler(req, res);
            return result;
        } catch (e) {
            console.error(e);
            internalServerError(res, 'Something went wrong');
        }
    };
};