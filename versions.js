import { Router } from 'express';
import anime from './v1/anime/routes';

export function Version1() {
    const router = Router();

    router.use('/anime', anime);

    return router;
}