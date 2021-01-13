const mongoose = require('mongoose');
const config = require('config');
// const db = config.get('mongoURI');

// Express Session
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


require('dotenv').config();


// Establish mongo connection and handle errors at initialization
// const connectDB = async () => {
//   try {
//     await mongoose.connect(db, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true
//     });

//     console.log('MongoDB Connected...');
//   } catch (err) {
//     console.log(err.message);
//     // Exit process with failure
//     process.exit(1);
//   }
// };

// connectDB();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
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
  console.log(`You have successfully connected to your mongodatabase: ${process.env.MONGO_URI}`);
})

const sessionStore = new MongoStore({ mongooseConnection: mongoConnection, collection: 'sessions' });


module.exports = sessionStore;

// const connection = mongoose.createConnection(db, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true
// });

// module.exports = connection;
