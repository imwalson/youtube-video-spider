const datastore = require('nedb-promise');
const path = require("path");
const makeDir = require('make-dir');
let DB;

async function initDB() {
  if (!DB) {
    await makeDir( path.resolve(__dirname, '../data') );
    DB = datastore({
      // these options are passed through to nedb.Datastore
      filename: path.resolve(__dirname, '../data', 'my-db.json'),
      autoload: true // so that we don't have to call loadDatabase()
    })
    return DB;
  } else {
    return DB;
  }
}

module.exports.initDB = initDB;