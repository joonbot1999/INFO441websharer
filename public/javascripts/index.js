function init(){
    let urlInput = document.getElementById("urlInput");
    urlInput.onkeyup = previewUrl;
    urlInput.onchange = previewUrl;
    urlInput.onclick = previewUrl;
    loadPosts();
}

async function loadPosts(){
    document.getElementById("posts_box").innerText = "Loading...";
    let postsJson = await fetchJSON(`api/${apiVersion}/posts`)
    let postsHtml = postsJson.map(postInfo => {
        console.log(postInfo.contentType)
        return `<div class="post" style="box-shadow: 5px 10px; background-color: white; font-family: Koldby;">
                    <div style="background-color: #FFFBE6;">
                        <div style="text-align: center; margin:0 auto;">
                            <p>User submitted description: ${postInfo.description}</p>
                        </div>
                        <br>
                        <div style="text-align: center; margin:0 auto;">
                            <p>User submitted content type: ${postInfo.contentType}</p>
                        </div>
                    </div>
                    ${postInfo.htmlPreview}
                </div>`
    }).join("\n");
    document.getElementById("posts_box").innerHTML = postsHtml;
}

async function postUrl(){
    let url = document.getElementById("urlInput").value;
    let description = document.getElementById("descriptionInput").value;
    let radioContent = document.getElementById("radioID")
    let contentTypeRadio = ""
    if (url == "" || description == "") {
        alert("None of the fields must be empty!")
    } else {
        document.getElementById("postStatus").innerHTML = "sending data..."
        for (let i = 0; i < radioContent.children.length; i++) {
            if (radioContent.children[i].checked) {
                contentTypeRadio = radioContent.children[i + 1].innerText
            }
        }
        console.log(contentTypeRadio)
        try{
            await fetchJSON(`api/${apiVersion}/posts`, {
                method: "POST",
                body: {url: url, description: description, type: contentTypeRadio}
            })
        }catch(error){
            document.getElementById("postStatus").innerText = "Error"
            throw(error)
        }
        document.getElementById("urlInput").value = "";
        document.getElementById("descriptionInput").value = "";
        document.getElementById("url_previews").innerHTML = "";
        document.getElementById("postStatus").innerHTML = "successfully uploaded"
        loadPosts();
    }
}


let lastTypedUrl = ""
let lastTypedTime = Date.now();
let lastURLPreviewed = "";
async function previewUrl(){
    document.getElementById("postStatus").innerHTML = "";
    let url = document.getElementById("urlInput").value;

    // make sure we are looking at a new url (they might have clicked or something, but not changed the text)
    if(url != lastTypedUrl){
        
        //In order to not overwhelm the server,
        // if we recently made a request (in the last 0.5s), pause in case the user is still typing
        lastTypedUrl = url;
        let timeSinceLastType = Date.now() - lastTypedTime
        lastTypedTime = Date.now()
        if(timeSinceLastType < 500){ 
            await new Promise(r => setTimeout(r, 1000)) // wait 1 second
        }
        // if after pausing the last typed url is still our current url, then continue
        // otherwise, they were typing during our 1 second pause and we should stop trying
        // to preview this outdated url
        if(url != lastTypedUrl){
            return;
        }
        
        if(url != lastURLPreviewed) { // make sure this isn't the one we just previewd
            lastURLPreviewed = url; // mark this url as one we are previewing
            document.getElementById("url_previews").innerHTML = "Loading preview..."
            try{
                let response = await fetch(`api/${apiVersion}/urls/preview?url=` + url)
                let previewHtml = await response.text()
                if(url == lastURLPreviewed){
                    document.getElementById("url_previews").innerHTML = previewHtml;
                }
            }catch(error){
                document.getElementById("url_previews").innerHTML = "There was an error: " + error;
            }
        }
    }
}

