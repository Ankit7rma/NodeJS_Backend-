const dotenv = require('dotenv');
const mongoose = require('mongoose');

require('dotenv').config();
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then((con) => {
  // console.log(con.connections);
  console.log('MongoDB connected Success');
});
// console.log(process.env);
// console.log(app.get('env'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server running');
});
