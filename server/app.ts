import express from 'express';
import path from 'path';
import gameAPI from './api/gameAPI';
import * as bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 8181;

app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../static')))
app.use('/game', gameAPI);

app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
});
