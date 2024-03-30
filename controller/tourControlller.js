/* eslint-disable no-lone-blocks */
/* eslint-disable arrow-body-style */
/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-object-spread */
const { json } = require('express');
const fs = require('fs');
const APIFeatures = require('../utils/apiFeatures');

const catchAsync = require('../utils/catchAsync');

const Tour = require('../models/tourModel');

// For testing we read file and executed on that hardcoded data
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

// Middleware param to check the id
// exports.checkId = (req, res, next, val) => {
//   console.log(`Tour id is ${val}`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
// };

// Middleware to check for name and price
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing Name or Price',
//     });
//   }
//   next();
// };

exports.aliasTop5Tours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,ratingsAverage,summary,difficulty';

  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // Filtering
    // const queryObject = { ...req.query };
    // const excludeFields = ['sort', 'page', 'fields', 'limit'];
    // excludeFields.forEach((el) => delete queryObject[el]);

    // // Advance Filtering

    // let queryString = JSON.stringify(queryObject);
    // queryString = queryString.replace(
    //   /\b(gte|gt|lte|lt)\b/g,
    //   (match) => `$${match}`,
    // ); // \b will find the exact word and g will do it multiple times without it will replace the first occurance
    // // { duration: { '$lte': 5 }, difficulty: 'easy' }

    // let query = Tour.find(JSON.parse(queryString)); //build query
    // const tours = await Tour.find();

    // Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }
    // If want to sort in descending order use (-)
    // sort("price,ratingsAvg")

    // Limiting Fields  (Showing Only What wanted )
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');

    //   query = query.select(fields);
    //   // query = query.select('name duration price'); //Example
    // } else {
    //   query = query.select('-__v'); //excluding __v
    // }

    // Pagination
    // page=2&limit=5 1-5.page-1,6-10,page-2
    // const page = req.query.page * 1;

    // const limit = req.query.limit * 1;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('This Page does not exists');
    // }

    // Second Way to filter
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query; //execute query

    res.status(200).json({
      status: 'Success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: { tours },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getTour = async (req, res) => {
  // Old Method
  // console.log(req.params);
  // const id = req.params.id * 1;
  // const tour = tours.find((ele) => ele.id === id);

  try {
    // Tour.findOne({_id:req.params.id})
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

//old method using try catch
{
  // exports.createTour = async (req, res) => {
  //   console.log(req.body);
  //   // How we save using making another document then saving that document
  //   // const newTour = new Tour();
  //   // newTour.save()
  //   try {
  //     const newTour = await Tour.create(req.body);
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tour: newTour,
  //       },
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       status: 'fail',
  //       message: error.message,
  //     });
  //   }
  //   // How we saved our newtour in creating the existing hardcoded file data
  //   // const tourId = tours[tours.length - 1].id + 1;
  //   // const newTour = Object.assign({ id: tourId }, req.body);
  //   // tours.push(newTour);
  //   // fs.writeFile(
  //   //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   //   JSON.stringify(tours),
  //   //   (err) => {
  //   // res.status(201).json({
  //   //   status: 'success',
  //   //   data: {
  //   //     tour: newTour,
  //   //   },
  //   // });
  //   //   },
  //   // );
  //   // res.send('Post request finished');
  // };
  // exports.updateTour = async (req, res) => {
  //   try {
  //     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
  //       new: true,
  //       runValidators: true,
  //     });
  //     res.status(200).json({
  //       status: 'Success',
  //       data: {
  //         tour,
  //       },
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       status: 'fail',
  //       message: error.message,
  //     });
  //   }
  // };
  // exports.deleteTour = async (req, res) => {
  //   try {
  //     await Tour.findByIdAndDelete(req.params.id);
  //     res.status(204).json({
  //       status: 'Success',
  //       data: null,
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       status: 'fail',
  //       message: error.message,
  //     });
  //   }
  // };
  // exports.getTourStats = async (req, res) => {
  //   try {
  //     const stats = await Tour.aggregate([
  //       // Stage 1: Match tours with ratingsAverage greater than or equal to 4.5
  //       { $match: { ratingsAverage: { $gte: 4.5 } } },
  //       // Stage 2: Group tours based on difficulty
  //       {
  //         $group: {
  //           _id: { $toUpper: '$difficulty' }, // Grouping by difficulty (converting to uppercase)
  //           numTours: { $sum: 1 }, // Counting the number of tours in each group
  //           numRatings: { $sum: '$ratingsQuantity' }, // Summing up ratingsQuantity for each group
  //           avgRating: { $avg: '$ratingsAverage' }, // Calculating the average ratingsAverage for each group
  //           avgPrice: { $avg: '$price' }, // Calculating the average price for each group
  //           minPrice: { $min: '$price' }, // Finding the minimum price for each group
  //           maxPrice: { $max: '$price' }, // Finding the maximum price for each group
  //         },
  //       },
  //       // Stage 3: Sort the results by avgPrice in ascending order
  //       { $sort: { avgPrice: 1 } },
  //       // Optional Stage 4: Additional matching condition, if needed
  //       // { $match: { _id: { $ne: 'EASY' } } },
  //     ]);
  //     res.status(200).json({
  //       status: 'success',
  //       data: {
  //         stats,
  //       },
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       status: 'fail',
  //       message: error,
  //     });
  //   }
  // };
  // exports.getMonthlyPlan = async (req, res) => {
  //   try {
  //     // Extract the year from the request parameters and convert it to a number
  //     const year = req.params.year * 1;
  //     // Aggregate tour data using MongoDB aggregation pipeline
  //     const plan = await Tour.aggregate([
  //       // Deconstructs the 'startDates' array field to output a document for each element
  //       {
  //         $unwind: '$startDates',
  //       },
  //       // Match documents with 'startDates' falling within the specified year
  //       {
  //         $match: {
  //           startDates: {
  //             $gte: new Date(`${year}-01-01`), // Greater than or equal to Jan 1st of the year
  //             $lte: new Date(`${year}-12-31`), // Less than or equal to Dec 31st of the year
  //           },
  //         },
  //       },
  //       // Group documents by month of 'startDates', counting the number of tours and pushing tour names into an array for each month
  //       {
  //         $group: {
  //           _id: { $month: '$startDates' },
  //           numTourStarts: { $sum: 1 },
  //           tours: { $push: '$name' },
  //         },
  //       },
  //       // Add a new field 'month' representing the month extracted from '_id'
  //       {
  //         $addFields: { month: '$_id' },
  //       },
  //       // Exclude the '_id' field from the output
  //       {
  //         $project: {
  //           _id: 0,
  //         },
  //       },
  //       // Sort documents by 'numTourStarts' in descending order
  //       {
  //         $sort: {
  //           numTourStarts: -1,
  //         },
  //       },
  //       // Limit the output to 12 documents (for 12 months)
  //       {
  //         $limit: 12,
  //       },
  //     ]);
  //     // Send a successful response with the tour plan data
  //     res.status(200).json({
  //       status: 'success',
  //       data: {
  //         plan,
  //       },
  //     });
  //   } catch (error) {
  //     // Send an error response if an error occurs during execution
  //     res.status(400).json({
  //       status: 'fail',
  //       message: error,
  //     });
  //   }
  // };
}

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'Success',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    // Stage 1: Match tours with ratingsAverage greater than or equal to 4.5
    { $match: { ratingsAverage: { $gte: 4.5 } } },

    // Stage 2: Group tours based on difficulty
    {
      $group: {
        _id: { $toUpper: '$difficulty' }, // Grouping by difficulty (converting to uppercase)
        numTours: { $sum: 1 }, // Counting the number of tours in each group
        numRatings: { $sum: '$ratingsQuantity' }, // Summing up ratingsQuantity for each group
        avgRating: { $avg: '$ratingsAverage' }, // Calculating the average ratingsAverage for each group
        avgPrice: { $avg: '$price' }, // Calculating the average price for each group
        minPrice: { $min: '$price' }, // Finding the minimum price for each group
        maxPrice: { $max: '$price' }, // Finding the maximum price for each group
      },
    },

    // Stage 3: Sort the results by avgPrice in ascending order
    { $sort: { avgPrice: 1 } },

    // Optional Stage 4: Additional matching condition, if needed
    // { $match: { _id: { $ne: 'EASY' } } },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // Extract the year from the request parameters and convert it to a number
  const year = req.params.year * 1;

  // Aggregate tour data using MongoDB aggregation pipeline
  const plan = await Tour.aggregate([
    // Deconstructs the 'startDates' array field to output a document for each element
    {
      $unwind: '$startDates',
    },
    // Match documents with 'startDates' falling within the specified year
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`), // Greater than or equal to Jan 1st of the year
          $lte: new Date(`${year}-12-31`), // Less than or equal to Dec 31st of the year
        },
      },
    },
    // Group documents by month of 'startDates', counting the number of tours and pushing tour names into an array for each month
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    // Add a new field 'month' representing the month extracted from '_id'
    {
      $addFields: { month: '$_id' },
    },
    // Exclude the '_id' field from the output
    {
      $project: {
        _id: 0,
      },
    },
    // Sort documents by 'numTourStarts' in descending order
    {
      $sort: {
        numTourStarts: -1,
      },
    },
    // Limit the output to 12 documents (for 12 months)
    {
      $limit: 12,
    },
  ]);

  // Send a successful response with the tour plan data
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
