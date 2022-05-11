import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.post('/', async function (req, res, next) {
  let session = req.session
  if (session.isAuthenticated) {
    try {
        const newPost = new req.models.Post({
          url: req.body.url,
          description: req.body.description,
          username: session.account.username,
          created_date: Date()
        })
        await newPost.save()
        let succJSON = {status: "success"}
        res.json(succJSON);
      } catch(error) {
        console.log(error)
        res.status(500).json({status: "error", error: error})
      }
  } else {
    res.status(401).json({
      status: "error",
      error: "not logged in"
   })
  }
})

router.get('/', async function (req, res, next) {
  let userN = req.query.username
  console.log(userN)
  let allPosts = await req.models.Post.find()
  try {
    let urlJSONArr = []
    let allArr = []
    for (let i = 0; i < allPosts.length; i++) {
        let htmlObj = await getURLPreview(allPosts[i].url)
        let userInfo = allPosts[i].username
        let urlJSON = {
            description: allPosts[i].description,
            htmlPreview: htmlObj,
            username: userInfo
        }
        if (userN != null && userN == userInfo) {
          urlJSONArr.push(urlJSON)
        } else if (userN == null) {
          allArr.push(urlJSON)
        }
    }
    console.log(urlJSONArr)
    let toRetArr
    if (allArr.length != 0) {
      toRetArr = allArr
      console.log("all check")
    } else {
      toRetArr = urlJSONArr
      console.log("specific check")
    }
    res.type('array')
    res.send(toRetArr)
  } catch(error) {
    console.log(error)
    res.status(500).json({status: "error", error: error})
  }
})

export default router;