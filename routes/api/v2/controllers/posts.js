import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.post('/', async function (req, res, next) {
    try {
        const newPost = new req.models.Post({
          url: req.body.url,
          description: req.body.description,
          created_date: Date(),
          content_type: req.body.type
        })
        await newPost.save()
        let succJSON = {status: "success"}
        res.json(succJSON);
      } catch(error) {
        console.log(error)
        res.status(500).json({status: "error", error: error})
      }
})

router.get('/', async function (req, res, next) {
  let allPosts = await req.models.Post.find()
  try {
    let urlJSONArr = []
    for (let i = 0; i < allPosts.length; i++) {
        let htmlObj = await getURLPreview(allPosts[i].url)
        let urlJSON = {
            description: allPosts[i].description,
            htmlPreview: htmlObj,
            contentType: allPosts[i].content_type
        }
        urlJSONArr.push(urlJSON)
    }
    console.log(urlJSONArr)
    res.type('array')
    res.send(urlJSONArr)
  } catch(error) {
    console.log(error)
    res.status(500).json({status: "error", error: error})
  }
})

export default router;