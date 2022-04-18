import express from 'express';
var router = express.Router();
import fetch from 'node-fetch'
import parser from 'node-html-parser'
import path from 'path'

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('listening.....');
});

router.get('/urls/preview', async function(req, res, next) {
    let urlLink = req.query.url
    fetch(urlLink)
        .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
            return response.text();
        } else {
            let errorMessage = "Status Code: " + response.statusText
            res.type('html')
            // Handle the error
            let htmlContent = 
                `<div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center;"> 
                <p><strong> 
                    ${errorMessage}
                </strong></p>
                </div>`
            res.send(htmlContent)
        }
    })
        .then((textResponse) => {
            // do whatever you want with the JSON response
            let cssDirectory = path.resolve() + "/public/stylesheets/style.css"
            console.log(cssDirectory)
            res.type('html')
            let htmlData = parser.parse(textResponse)
            let url = htmlData.querySelector("meta[property='og:url']")
            let description = htmlData.querySelector("meta[property='og:description']")
            let image = htmlData.querySelector("meta[property='og:image']")
            let title = htmlData.querySelector("meta[property='og:title']")
            let contentType = htmlData.querySelector("meta[property='og:type']")
            console.log(contentType)
            let urlTag = ""
            let descTag = ""
            let imageTag = ""
            let titleTag = ""
            let contentTag = ""
            if (url == null) {
                urlTag = urlLink
            } else {
                urlTag = url.getAttribute('content')
            }
            if (image != null) {
                imageTag = "<img src=" + image.getAttribute('content') + " style=\"max-height: 200px; max-width: 270px;\">"
            } else {
                imageTag = "<img src=https://art.pixilart.com/d8a5d6f1f1f432a.png style=\"max-height: 200px; max-width: 270px;\" alt=\"image not found\">"
            }
            if (description != null) {
                descTag = "<p style=\"border:orange; border-width:5px; border-style:solid;\">" + description.getAttribute('content') + "</p>" 
            }
            if (title == null) {
                if (htmlData.getElementsByTagName('title')[0] == null) {
                    titleTag = urlTag
                } else {
                    titleTag = htmlData.getElementsByTagName('title')[0].innerHTML
                }
            } else {
                titleTag = title.getAttribute('content')
            }
            if (contentType != null) {
                contentTag = "<p style=\"border:red; border-width:5px; border-style:solid;\"> Content type: " + contentType.getAttribute('content') + "</p>" 
            } else {
                contentTag = "<p style=\"border:red; border-width:5px; border-style:solid;\"> Content type: misc. </p>" 
            }
            let htmlContent = 
                `<div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center;"> 
                <a href=${urlTag}>
                    <p><strong> 
                        ${titleTag}
                    </strong></p>
                    ${imageTag}
                </a>
                <br>
                ${descTag}
                ${contentTag}
                </div>`
             res.send(htmlContent)
        }).catch((error) => {
            res.type('html')
            // Handle the error
            let htmlContent = 
                `<div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center;"> 
                <p><strong> 
                    ${error}
                </strong></p>
                </div>`
            res.send(htmlContent)
        });
    });

export default router;