const dotenv = require('dotenv');

const fs = require('fs');

const mongoose = require('mongoose');

const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

const DbString = process.env.DB.replace('<password>', process.env.DB_PASSWORD);

mongoose.connect(DbString).then(() => {
  // console.log(con.connection);
  console.log('DB Connection Done Succesfully');
});

//   READ JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data imported Successfully');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete DATA from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted Successfully');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

console.log(process.argv);

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
