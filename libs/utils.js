const fs = require("fs");
const path = require("path");
const axios = require('axios');
const makeDir = require('make-dir');

function getKeywords() {
  return new Promise((resolve,reject) => {
    fs.readFile( path.join(__dirname, "../keywords.txt") , 'utf-8', (err, data) => {
      if (err) reject(err);
      const arr = data.split('\n');
      // console.log(arr)
      resolve(arr);
    });
  })
}
// getKeywords()

function getTodayString() {
  var str,year,month,day;
  var date = new Date();
  year = date.getFullYear();
  month = date.getMonth() + 1;
  day = date.getDate(); 
  str = year.toString() + '-' + (month>9?month:'0'+month) + '-' + (day>9?day:'0'+day);
  return str;
}

function downloadVideo (url, name) {
  console.log(`下载视频: ${name}`);
  return new Promise((resolve, reject) => {
    try {
      const timeout = 60 * 60 * 1000; // 60 分钟超时
      const savePath = path.resolve(__dirname, '../download/' + getTodayString() , name + '.mp4')
      const writer = fs.createWriteStream(savePath)
      makeDir( path.resolve(__dirname, '../download/' + getTodayString()) ).then(() => {
        return axios({
          url,
          method: 'GET',
          responseType: 'stream'
        })
      }).then((response) => {
        response.data.pipe(writer)
        writer.on('finish', () => {
          console.log('download finish!');
          resolve(savePath);
        })
        writer.on('error', () => {
          reject('stream write error');
        })
        // 超时时间
        setTimeout(() => {
          reject('timeout');
        }, timeout);
      }).catch((error) => {
        console.log('http requst error');
        reject(error.message);
      })
    } catch (error) {
      console.log('downloadVideo failed');
      console.log(error);
      reject(error.message);
    }
  })
}

// downloadVideo ('https://cloud.video.alibaba.com/play/u/2153292369/p/1/e/6/t/1/d/hd/236588446751.mp4', 'test')
// downloadVideo ('https://r2---sn-ci5gup-cags.googlevideo.com/videoplayback?expire=1581867865&ei=-Q5JXpO3J9i6owPthZbwAQ&ip=103.251.108.4&id=o-AIYQXe2B6cAIpC1DkI75C7HXGHy5KzppmWeKMi3nV2tG&itag=22&source=youtube&requiressl=yes&mm=31%2C29&mn=sn-ci5gup-cags%2Csn-h557snsl&ms=au%2Crdu&mv=u&mvi=1&pl=24&vprv=1&mime=video%2Fmp4&ratebypass=yes&dur=491.496&lmt=1580119145273800&mt=1581845973&fvip=2&fexp=23842630&c=WEB&txp=5535432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cratebypass%2Cdur%2Clmt&sig=ALgxI2wwRQIgAwCg_AYK4bnW-7o_gebCBdMgyrasJY0ZaOdpKMFMANMCIQDs4nlLXZuWDcMF6-qaV0x6CriHTrfOifte-z4XQ-fiYQ%3D%3D&lsparams=mm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl&lsig=AHylml4wRQIgG5x0iQNM0BK57RxPc5vncU6tKQVYiRz_-rgsnEtYFE0CIQCIsz_a5icsDMayF8SYaw3hMT7tIyLFb3cUvijoofttWQ%3D%3D', 'test_yt')
// .then( res => {
//   console.log('下载成功！');
// })
// .catch( e => {
//   console.log(e);
// })

module.exports.getKeywords = getKeywords;
module.exports.getTodayString = getTodayString;
module.exports.downloadVideo = downloadVideo;