import express from 'express';
import fetch from 'node-fetch';

var router = express.Router();

const apiKey = "AIzaSyBW7bCXK3Y6uvUTUK-7BkcOpednKX0oIVU"

router.post('/', async function (req, res, next) {
    let session = req.session
    console.log("Trying to post")
    let youtuber = req.body.youtuber
    if (session.isAuthenticated) {
        try {
            let response = await getUserID(youtuber)
            console.log(response[0].id)
            if (response == null) {
                res.status(500).json({status:"error", error: error})
            } else {
                let existingUser = await req.models.Userinfo.find({username: session.account.username})
                let youtuberCred = ""
                if (existingUser.length == 0) {
                    console.log("I'm here")
                    youtuberCred = new req.models.Userinfo({
                        username: session.account.username,
                        youtuber: response[0].id,
                        youtuber_name: youtuber
                    })
                    await youtuberCred.save()
                } else {
                    let id = existingUser[0]._id
                    let updateInfo = await req.models.Userinfo.findById(id)
                    updateInfo.youtuber = response[0].id
                    updateInfo.youtuber_name = youtuber
                    await updateInfo.save()
                }
                let succJSON = {status: "success"}
                res.json(succJSON);
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
  
async function getUserID(youtuber) {
    let url = "https://www.googleapis.com/youtube/v3/channels?key=" + apiKey + "&forUsername=" + youtuber + "&part=id"
    let response = await fetch(url)
    let data = await response.json()
    return data.items
}

router.get('/', async function (req, res, next) {
    let username = req.query.name
    console.log(username)
    try {
        let favTuber = await req.models.Userinfo.find({username: username})
        if (favTuber.length == 0) {
            console.log("no youtubers")
            res.json({fav_youtuber: "none"})
        } else {
            let youtuberID = favTuber[0].youtuber
            console.log(youtuberID)
            let apiPath = "https://www.googleapis.com/youtube/v3/search?key=" + apiKey + "&channelId=" + youtuberID + "&part=snippet,id&order=date&maxResults=50"
            let response = await fetch(apiPath)
            let data = await response.json()
            var arr = [];
            while(arr.length < 5){
                var r = Math.floor(Math.random() * 50);
                if(arr.indexOf(r) === -1) arr.push(r);
            }
            let vidList = []
            console.log(data)
            if (data.items.length < 50) {
                res.json({error: favTuber[0].youtuber_name + " has less than 50 uploads"})
            } else {
                for (let i = 0; i < arr.length; i++) {
                    let itemIndex = arr[i]
                    let youtubeItem = data.items[itemIndex]
                    let youtubeEmbed = "https://www.youtube.com/watch?v=" + youtubeItem.id.videoId
                    vidList.push([youtubeEmbed, youtubeItem.snippet.thumbnails.default.url, youtubeItem.snippet.title, favTuber[0].youtuber_name])
                }
                res.send(vidList)
            }
        }
    } catch(error) {
        console.log(error)
        res.status(500).json({status: "error", error: error}) 
    }
})

export default router