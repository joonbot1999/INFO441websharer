import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

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

router.post('/like', async function (req, res, next) {
  let session = req.session
  let postId = req.body.postID
  if (session.isAuthenticated) {
    try {
      let likePost = await req.models.Post.findById(postId)
      console.log(likePost)
      if (!likePost.likes.includes(session.account.username)) {
        likePost.likes.push(session.account.username)
      }
      await likePost.save()
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

router.post('/unlike', async function (req, res, next) {
  let session = req.session
  let postId = req.body.postID
  console.log("Trying to unlike it")
  if (session.isAuthenticated) {
    try {
      let likePost = await req.models.Post.findById(postId)
      if (likePost.likes.includes(session.account.username)) {
        console.log("Found it")
        var index = likePost.likes.indexOf(session.account.username);
        if (index > -1) {
            likePost.likes.splice(index, 1);
        }
        console.log("Unliked it")
      }
      await likePost.save()
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
  let allPosts = await req.models.Post.find()
  try {
    let urlJSONArr = []
    let allArr = []
    for (let i = 0; i < allPosts.length; i++) {
        let htmlObj = await getURLPreview(allPosts[i].url)
        let postId = allPosts[i]._id
        console.log(postId)
        let userInfo = allPosts[i].username
        let urlJSON = {
            id: postId,
            url: allPosts[i].url,
            description: allPosts[i].description,
            htmlPreview: htmlObj,
            username: userInfo,
            likes: allPosts[i].likes,
            created_date: allPosts[i].created_date
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

router.delete("/", async (req, res, next) => {
  let session = req.session
  let postId = req.body.postID
  console.log("Trying to delete")
  if (session.isAuthenticated) {
    try {
      let likePost = await req.models.Post.findById(postId)
      if (session.account.username != likePost.username) {
        res.status(401).json({
          status: 'error',
          error: "you can only delete your own posts"
       })
      } else {
        await req.models.Comment.deleteMany({post: postId})
        await req.models.Post.deleteOne({_id: postId})
        res.json({status: "success"})
      }
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

export default router;