/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
const dotenv = require('dotenv');

const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: './config.env' });
const app = require('./app');

const DbString = process.env.DB.replace('<password>', process.env.DB_PASSWORD);

mongoose
  .connect(DbString, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connection);
    console.log('DB Connection Done Succesfully');
  });

// For Testing

// const testTour = new Tour({
//   name: 'The Forest Hiker',
//   rating: 4.3,
//   price: 400,
// });

// testTour
//   .save()
//   .then((doc) => console.log(doc))
//   .catch((err) => console.log('Error🔥', err));

const port = process.env.Node || 3000;
const server = app.listen(port, () => console.log(`Hello from server ${port}`));

// console.log(app.get('env'));
// console.log(process.env);

// Unhandled Errors
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection 🔥 Shutting Down');
  server.close(() => {
    process.exit(1);
  });
});
