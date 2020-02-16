const express = require('express');
const app = express();
const initDB = require('./libs/db').initDB;
let DB;

function getPage(p) {
  var page = 1;
  if(p){
    try {
      page = parseInt(p);
    } catch (error) {}
  }
  page = (page <= 0) ? 1 : page;
  return page;
}

app.use(express.static('public'));

app.get('/', function(req, res){
  res.setHeader('Content-Type', 'text/html');
  res.sendfile(`${__dirname}/public/index.html`)
});

app.get('/health', function(req, res){
  res.json({ success: true, data: 'your server is running!' });
});

app.get('/api/youtube/list', async function(req, res){
  const pageSize = 20;
  let page = req.query.page || '';
  page = getPage(page);
  let documents = await DB.cfind({})
    .projection({
      type: 0,
      _id: 0
    })
    .sort({ createAt: -1 })
    .skip( (page-1)*pageSize )
    .limit(pageSize)
    .exec();
  res.json(documents);
});

const port = process.env.PORT || 3000;

initDB()
  .then( data => {
    DB = data;
    app.listen(port);
    console.log('your server is running at port: ' + port);
  })
  .catch( e => {
    console.log('load DB error');
    console.log(e);
  })

module.exports = app;