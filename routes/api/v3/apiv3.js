import express from 'express';
var router = express.Router();

import postsRouter from './controllers/posts.js';
import urlsRouter from './controllers/urls.js';
import userRouter from './controllers/users.js';
import commentsRouter from './controllers/comments.js';

router.use('/posts', postsRouter);
router.use('/urls', urlsRouter);
router.use('/users', userRouter);
router.use('/comments', commentsRouter)

export default router;