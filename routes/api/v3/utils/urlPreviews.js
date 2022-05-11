import fetch from 'node-fetch';
import parser from 'node-html-parser';

const escapeHTML = str => str.replace(/[&<>'"]/g, 
  tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag]));

async function getURLPreview(url){
  // TODO: Copy from your code for making url previews in A2 to make this 
  // a function that takes a url and returns an html string with a preview of that html
  let urlLink = url
  console.log("urllink is " + url)
  let htmlReturn = await fetch(urlLink).then((response) => {
    if (response.status >= 200 && response.status <= 299) {
        return response.text()
    } else {
        let errorMessage = "Status Code: " + response.statusText
        // Handle the error
        let htmlContent = 
            `<div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center;"> 
            <p><strong> 
                ${errorMessage}
            </strong></p>
            </div>`
        return htmlContent
      }
  }).then((textResponse) => {
        // do whatever you want with the JSON response
        let htmlData = parser.parse(textResponse)
        let url = htmlData.querySelector("meta[property='og:url']")
        let description = htmlData.querySelector("meta[property='og:description']")
        let image = htmlData.querySelector("meta[property='og:image']")
        let title = htmlData.querySelector("meta[property='og:title']")
        let contentType = htmlData.querySelector("meta[property='og:type']")
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
            descTag = "<p style=\"border:orange; border-width:5px; border-style:solid;\">" + escapeHTML(description.getAttribute('content')) + "</p>" 
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
            contentTag = "<p style=\"border:red; border-width:5px; border-style:solid;\"> Content type: " + escapeHTML(contentType.getAttribute('content')) + "</p>" 
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
        return htmlContent
    }).catch((error) => {
        // Handle the error
        console.log("sth failed")
        let htmlContent = 
            `<div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center;"> 
            <p><strong> 
                ${error}
            </strong></p>
            </div>`
        return htmlContent
    })
    return htmlReturn
}

export default getURLPreview;