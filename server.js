/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
const dotenv = require('dotenv');

const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DbString = process.env.DB.replace('<password>', process.env.DB_PASSWORD);

mongoose
  .connect(DbString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connection);
    console.log('Connection Done Succesfully');
  });

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name '],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Forest Hiker',
  rating: 4.3,
  price: 400,
});

testTour
  .save()
  .then((doc) => console.log(doc))
  .catch((err) => console.log('Error🔥', err));

const port = process.env.Node || 3000;
app.listen(3000, () => console.log(`Hello from server ${port}`));

// console.log(app.get('env'));
// console.log(process.env);
