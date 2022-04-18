
async function previewUrl(){
    let url = document.getElementById("urlInput").value;
    let preview = await fetch("api/v1/urls/preview?url=" + url)
    let responseData = await preview.text()
    displayPreviews(responseData)
}

function displayPreviews(previewHTML){
    document.getElementById("url_previews").innerHTML = previewHTML;
}
