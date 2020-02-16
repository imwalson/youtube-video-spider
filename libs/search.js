const ytsr = require('ytsr');
let filter;

/**
 * 
 * @param {*} keyword 
 * @param {*} uploadDate 
 * @param {*} sort 
 * response demo:
 * {
    query: 'tiktok girls',
    items: [
      {
        type: 'video',
        title: 'SANRIO, ATE GIRL & STEPHEN TIKTOK DANCE',
        link: 'https://www.youtube.com/watch?v=VLHYtkj_ZK0',
        thumbnail: 'https://i.ytimg.com/vi/VLHYtkj_ZK0/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLC4JrUpVmM6lT8ZYAoXCkkqq1xc4w',
        author: [Object],
        description: null,
        views: 103,
        duration: '0:15',
        uploaded_at: '4 weeks ago'
      }
    ],
    nextpageRef: '/results?search_query=tiktok+girls&sp=CAESBAgEEAFIFJgBAeoDAA%253D%253D',
    results: 0,
    filters: [
      { ref: null, name: 'This month', active: true },
      { ref: null, name: 'Video', active: true },
      { ref: null, name: 'Rating', active: true }
    ],
    currentRef: 'https://www.youtube.com/results?search_query=tiktok+girls&sp=CAESBAgEEAE%253D'
  }
 */
function search(keyword, uploadDate, sort) {
  return new Promise((resolve,reject) => {
    ytsr.getFilters(keyword, function(err, filters) {
      if(err) reject(err);
      filter = filters.get('Upload date').find(o => o.name === uploadDate ); // 'This month' or 'This year'
        ytsr.getFilters(filter.ref, function(err, filters) {
          if(err) reject(err);
          filter = filters.get('Sort by').find(o => o.name === sort); // 'View count' or 'Rating'
          const options = {
            limit: 20,
            nextpageRef: filter.ref,
          }
          ytsr(null, options, function(err, searchResults) {
            if(err) reject(err);
            // console.log(searchResults);
            resolve(searchResults);
          });
      });
    });
  })
}
// search('tiktok girls', 'This month', 'View count')

module.exports = search;

