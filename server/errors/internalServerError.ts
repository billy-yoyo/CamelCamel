import * as express from 'express';

export default function (res: express.Response, message?: string) {
    res.status(500).json({
        title: 'Internal server error',
        message
    });
}
