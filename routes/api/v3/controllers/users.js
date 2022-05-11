import express from 'express';

var router = express.Router();

//TODO: Add handlers here
router.get('/myIdentity', async function(req, res) {
    let session = req.session
    console.log(session)
    if (session.isAuthenticated) {
        res.json({
          status: "loggedin", 
          userInfo: {
             name: session.account.name, 
             username: session.account.username}
       })
      //res.send(`send the name: ${session.account.name} and the username: ${session.account.username}`)
    } else {
      res.json({ status: "loggedout" })
    }
})

export default router;