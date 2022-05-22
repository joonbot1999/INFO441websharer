async function init(){
    await loadIdentity();
    loadUserInfo();
}

async function saveUserInfo(){
    //TODO: do an ajax call to save whatever info you want about the user from the user table
    //see postComment() in the index.js file as an example of how to do this
    let identityInfo = await fetchJSON(`api/${apiVersion}/users/myIdentity`)
    if(identityInfo.status == "loggedin"){
        myIdentity = identityInfo.userInfo.username;
        youtuber = document.getElementById("youtuber").value
        if (youtuber.length == 0) {
            window.alert("This field cannot be empty")
        } else {
            let responseJSON = await fetchJSON(`api/${apiVersion}/youtubers`, {
                method: "POST",
                body: {youtuber: youtuber}
            })
        }
    }
}

async function loadUserInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    if(username==myIdentity){
        document.getElementById("username-span").innerText= `You (${username})`;
        document.getElementById("user_info_new_div").classList.remove("d-none");
    }else{
        document.getElementById("username-span").innerText=username;
        document.getElementById("user_info_new_div").classList.add("d-none");
    }
    let responseJSON = await fetch(`api/${apiVersion}/youtubers?name=` + username)
    let jsonData = await responseJSON.json()
    console.log(jsonData)
    if (jsonData.error) {
        document.getElementById("user_info_div").innerHTML = `<p>${jsonData.error}</p>`
    } else if (jsonData.fav_youtuber) {
        document.getElementById("user_info_div").innerHTML = `<p>This person does not have a favorite YouTuber</p>`
    } else {
        let postsHtml = jsonData.map(postInfo => {
            return `
            <div class="post">
                <a href=${postInfo[0]}>
                <p>${postInfo[2]}</p>
                <img class="images" src="${postInfo[1]}">
            </div>`
        }).join("\n");
        let htmlData = 
        `
        <div>
            <p>User ${username}'s favorite YouTuber is ${jsonData[0][3]}</p>
            <button onclick="loadUserInfo()">Get different videos by this creator</button>
            <div id="youtube-contents">
                ${postsHtml}
            </div>
        </div>
        `
        document.getElementById("user_info_div").innerHTML = htmlData
    }

    loadUserInfoPosts(username)
}


async function loadUserInfoPosts(username){
    document.getElementById("posts_box").innerText = "Loading...";
    let postsJson = await fetchJSON(`api/${apiVersion}/posts?username=${encodeURIComponent(username)}`);
    let postsHtml = postsJson.map(postInfo => {
        return `
        <div class="post">
            ${escapeHTML(postInfo.description)}
            ${postInfo.htmlPreview}
            <div><a href="/userInfo.html?user=${encodeURIComponent(postInfo.username)}">${escapeHTML(postInfo.username)}</a>, ${escapeHTML(postInfo.created_date)}</div>
            <div class="post-interactions">
                <div>
                    <span title="${postInfo.likes? escapeHTML(postInfo.likes.join(", ")) : ""}"> ${postInfo.likes ? `${postInfo.likes.length}` : 0} likes </span> &nbsp; &nbsp; 
                </div>
                <br>
                <div><button onclick='deletePost("${postInfo.id}")' class="${postInfo.username==myIdentity ? "": "d-none"}">Delete</button></div>
            </div>
        </div>`
    }).join("\n");
    document.getElementById("posts_box").innerHTML = postsHtml;
}


async function deletePost(postID){
    let responseJson = await fetchJSON(`api/${apiVersion}/posts`, {
        method: "DELETE",
        body: {postID: postID}
    })
    loadUserInfo();
}