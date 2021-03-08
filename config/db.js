const mongoose = require('mongoose');
const config = require('config');
// const db = config.get('mongoURI');

// Express Session
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


require('dotenv').config();

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB
} = process.env;

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

// Connect to mongodb and catch initialization errors
const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.log(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

connectDB();

// Event listeners for error after initialization
const mongoConnection = mongoose.connection;
mongoConnection.on('error', err => {
  console.log(`There was an error connecting to the database: ${err}`);
})
mongoConnection.once('open', ()=> {
  console.log(`You have successfully connected to your mongodatabase: ${url}`);
})

const sessionStore = new MongoStore({ mongooseConnection: mongoConnection, collection: 'sessions' });


module.exports = sessionStore;