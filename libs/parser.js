const ytdl = require('ytdl-core');

function getVideoInfo(url) {
  const videoId = ytdl.getVideoID(url);
  return new Promise((resolve,reject) => {
    ytdl.getInfo(videoId, (err, info) => {
      if (err) reject(err);
      // console.log(info);
      let format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
      let videoUrl = '';
      if (format) {
        // console.log(format);
        videoUrl = format.url;
        resolve({ videoId, videoUrl });
      } else {
        reject('no video');
      }
    });  
  })
}
// getVideoInfo("https://www.youtube.com/watch?v=nYJHroc6i_4")

module.exports = getVideoInfo;