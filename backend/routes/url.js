import express from 'express';
import { shortenUrl, redirectUrl, getAnalytics } from '../controller/UrlController.js';

const router = express.Router();

router.post('/shorten', shortenUrl);
router.get('/:shortId', redirectUrl);
router.get('/analytics/:shortId', getAnalytics);

export default router;
