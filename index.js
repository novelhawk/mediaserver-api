import express from 'express';
import { Version1 } from './versions';
const app = express();

app.use('/v1', Version1());

app.use('*', (_, res) => {
    res.sendStatus(404);
});

app.listen(8000);
