import * as express from 'express';

export default function (res: express.Response, message: string) {
    res.status(400).json({
        title: 'Bad request',
        message: message
    });
}
