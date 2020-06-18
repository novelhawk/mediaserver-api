import { Router } from 'express';
import { anime, list, season, episode } from './api';
const router = Router();

router.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

router.get('/list', list);
router.get('/:anime', anime);
router.get('/:anime/:season', season);
router.get('/:anime/:season/:episode', episode);

export default router;