const ytdl = require('ytdl-core');

const searchVideo = require('./libs/search');
const getVideoInfo = require('./libs/parser');
const getKeywords = require('./libs/utils').getKeywords;
const downloadVideo = require('./libs/utils').downloadVideo;
const getTodayString = require('./libs/utils').getTodayString;
const initDB = require('./libs/db').initDB;
const uploadDates = ['This month', 'This year'];
const sorts = ['View count', 'Rating'];

const searchConditions = (function() {
  const arr = [];
  uploadDates.forEach(date => {
    sorts.forEach(sort => {
      const obj = {
        uploadDate: date,
        sort: sort
      };
      arr.push(obj);
    })
  })
  return arr;
})();

async function runScript() {
  try {
    const DB = await initDB();
    console.log('nedb 数据库初始化完成');
    const keywords = await getKeywords();
    const kenLen = keywords.length;
    console.log(`总共包含${kenLen}组关键字`);
    let result = [];
    for (let i = 0; i< kenLen; i++) {
      let keyword = keywords[i];
      console.log(`开始爬取关键字： ${keyword}`);
      for (let n = 0; n< searchConditions.length; n++) {
        let searchCondition = searchConditions[n];
        console.log(`过滤条件： uploadDate=${searchCondition.uploadDate} && sort=${searchCondition.sort}`);
        let searchRes = await searchVideo(keyword, searchCondition.uploadDate, searchCondition.sort);
        let videoList = searchRes.items || [];
        console.log('查询到结果：' + videoList.length + '条');
        // console.log(videoList);
        for (let j = 0; j < videoList.length; j ++) {
          let videoInfo = videoList[j];
          let link = videoInfo.link;
          const videoId = ytdl.getVideoID(link);
          let videoUrl = ''; // 解析出的视频直链地址
          let video = ''; //保存后的视频地址
          // 视频排重
          let document = await DB.findOne({ videoId: videoId });
          if (!document) {
            try {
              // 开始解析视频文件地址
              console.log(`开始解析视频文件地址: ${link}`);
              let obj = await getVideoInfo(link);
              videoUrl = obj.videoUrl;
            } catch (error) {
              console.log('解析失败');
              console.log(error);
            }
            // 开始下载视频
            if (videoUrl) {
              // 视频排重
              console.log('开始下载视频: ' + videoId);
              video = await downloadVideo (videoUrl, videoId);
            }
            let info = {
              ...videoInfo,
              ...{
                videoId: videoId,
                downloadLink: videoUrl,
                video: video,
                createAt: new Date(),
                day: getTodayString()
              }
            }
            console.log(info);
            // 保存数据库
            await DB.insert(info);
            console.log('已存入数据库');
            // result.push(info);
          } else {
            console.log('视频已存在，无需重复抓取');
          }
        }
      }
    }
    console.log('爬虫脚本执行完毕！');
    // console.log(result);
  } catch (error) {
    console.log('爬虫脚本意外退出：');
    console.log(error);
  }
}
runScript();