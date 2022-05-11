import express from 'express';
var router = express.Router();

import postsRouter from './controllers/posts.js';
import urlsRouter from './controllers/urls.js';
import userRouter from './controllers/users.js';

router.use('/posts', postsRouter);
router.use('/urls', urlsRouter);
router.use('/users', userRouter);

export default router;