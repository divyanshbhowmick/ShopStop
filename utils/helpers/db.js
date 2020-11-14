/* eslint-disable prefer-destructuring */
const mongoose = require('mongoose');
const { isEmpty } = require('./dataHelper');

const USERNAME = process.env.MONGO_USERNAME;
const PASSWORD = process.env.MONGO_PASSWORD;
const DB_NAME = process.env.DB_NAME;
if (isEmpty(USERNAME) || isEmpty(PASSWORD) || isEmpty(DB_NAME)) {
  console.log('Check DB creds!');
  process.exit(0);
} else {
  const MONGO_URI = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.gdmkw.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
  mongoose
    .connect(MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log('DB connection Healthy!');
    })
    .catch((err) => {
      console.log(err.message);
    });
  mongoose.connection.on('connected', () =>
    console.log('Connected to DB succesfully!')
  );
  mongoose.connection.on('error', (err) =>
    console.log(`Connected to DB not succesfull! due the error: \n ${err} `)
  );
  mongoose.connection.on('disconnected', () =>
    console.log('Mongoose connection Disconnected')
  );
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
}
