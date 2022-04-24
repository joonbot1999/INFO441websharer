import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.get('/preview', async function(req, res) {
    let urlPath = req.query.url
    let path = await getURLPreview(urlPath)
    res.type('html')
    res.send(path)
})

export default router;