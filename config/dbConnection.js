const mongoose = require('mongoose');
require('dotenv').config();

const dbURL = process.env.DB_URL;
function dbConnection() {

    mongoose.Promise = global.Promise;
    mongoose.set('strictQuery', true);

    mongoose.connect(dbURL)
        .then(() => console.log("connected to mongodb"))
        .catch(err => console.error('>>> || Could not connect to MongoDB database || <<<<', err));

}

module.exports.connectMongo =  dbConnection;
