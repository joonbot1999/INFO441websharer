import express from 'express';

var router = express.Router();

router.post('/', async function (req, res, next) {
    let session = req.session
    console.log("Trying to post")
    console.log("postID for POST is " + req.body.postID)
    if (session.isAuthenticated) {
        try {
            const newComment = new req.models.Comment({
                username: session.account.username,
                comment: req.body.newComment,
                // used in line 37
                post: req.body.postID,
                created_date: Date()
            })
            await newComment.save()
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
    let postId = req.query.postID
    console.log("postId is " + postId)
    try {
        let commentList = await req.models.Comment.find({post: postId})
        res.json(commentList)
    } catch(error) {
        console.log(error)
        res.status(500).json({status: "error", error: error}) 
    }
})

export default router