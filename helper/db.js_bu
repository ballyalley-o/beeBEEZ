const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
require('dotenv').config();

let _db;

// const URL = process.env.MONGODB_STRING;

const DBURL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PW}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DB}`;

const mongoConnect = (callback) => {
    MongoClient.connect(DBURL)
      .then((client) => {
        console.log(`CONNECTED: ${process.env.MONGODB_DB}`.blue.inverse);
        _db = client.db();
         callback();
      })
      .catch((err) => {
        console.log(err);
      });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw "No database found!";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;