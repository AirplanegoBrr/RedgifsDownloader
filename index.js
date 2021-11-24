const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
//https://api.redgifs.com/v2/gifs/<gifID>

async function download(url, dest) {
    //wait for stream to finish then return destReal
    return new Promise(async (resolve, reject) => {
        //format dest
        dest = path.join(dest);
        //check if dest exists
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        //get last part of url
        let fileName = url.split('/').pop();
        let destReal = `${dest}/${fileName}.mp4`
        let APIurl = `https://api.redgifs.com/v2/gifs/${fileName}`
        let response = await fetch(APIurl);
        let data = await response.json();
        let gif = data.gif.urls.hd;
        let stream = fs.createWriteStream(destReal);
        await fetch(gif).then(res => res.body.pipe(stream));
        stream.on('finish', () => {
            resolve(destReal);
        })
        stream.on('error', (err) => {
            reject(err);
        })
    })
}

module.exports = {
    download
}