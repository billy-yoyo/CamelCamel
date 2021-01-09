import * as express from 'express';

export default function (res: express.Response, message: string) {
    res.status(404).json({
        title: 'Not found',
        message: message
    });
}
