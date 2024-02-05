const fs = require('fs');
const Tour = require('./../modals/tourModals');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

{
  // Testing
  // const toursData = JSON.parse(
  //   fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8')
  // );
  // For Reference if needed here we used mongoDB provided ID
  // exports.checkId = (req, res, next, val) => {
  //   console.log(`this is tour router id value is  ${val}`);
  //   if (req.params.id * 1 > toursData.length) {
  //     return res.status(200).json({
  //       status: 'Fail',
  //       message: 'Invalid ID ',
  //     });
  //   }
  //   next();
  // };
  // exports.checkBody = (req, res, next) => {
  //   console.log(`this is param middleware checking Body`);
  //   if (!req.body.name || !req.body.price) {
  //     return res.status(400).json({
  //       status: 'Fail',
  //       message: 'Missing name or price  ',
  //     });
  //   }
  //   next();
  // };
}

exports.getAllTours = async (req, res) => {
  // console.log(req.requestedTime);
  try {
    {
      // Build Query {
      // 1A) Filtering
      {
        // const queryObj = { ...req.query };
        // const excludedFields = ['page', 'sort', 'limit', 'fields'];

        // excludedFields.forEach((el) => delete queryObj[el]);

        {
          // const tours = await Tour.find({
          //   duration: 5,
          //   difficulty: 'difficult',
          // });
          // const tours = await Tour.find(req.query);
          // const tours = await Tour.find()
          //   .where('duration')
          //   .equals(5)
          //   .where('difficulty')
          //   .equals('easy');
          // }
        }

        // 2B)  Advance Filtering
        // for  greaterthanequal etc..

        // let queryStr = JSON.stringify(queryObj);
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        // console.log(req.query, queryStr);
        // \b is because we only want to match exact what mentioned
        //  g do it for every Operator as if we have 2 or 3 operator then it will replace all of them  else it will do for the first occurence
      }

      // Send Response
      // let query = Tour.find(JSON.parse(queryStr));

      // 2)Sorting
      {
        // if (req.query.sort) {
        //     const sortBy = req.query.sort.split(',').join(' ');
        //     console.log(sortBy);
        //     query = query.sort(sortBy);
        //     // sort=price for ascending order
        //     // sort = -price for descending order
        //     // sort = price,ratingsAverage for sort by many factors
        //   } else {
        //     query = query.sort('-createdAt');
        //   }
      }
      // 3) Fields
      {
        // if (req.query.fields) {
        //   const fields = req.query.fields.split(',').join(' ');
        //   query = query.select(fields);
        //   // to remove fields use - sign (example password to exclude or createdAt )
        // } else {
        //   query = query.select('-__v');
        // }
      }
      // 4)Pagination
      {
        // const page = req.query.page * 1 || 1;
        // const limit = req.query.limit * 1 || 100;
        // const skip = (page - 1) * limit;
        // query = query.skip(skip).limit(limit);
        // // if more pages and items are not there it should show error
        // if (req.query.page) {
        //   const numTours = await Tour.countDocuments();
        //   if (skip >= numTours) {
        //     throw new Error('This page does not exist ');
        //   }
        // }
      }
    }

    // Execute Query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;
    // query.sort().select().skip().limit()
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestedTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  // console.log(req.params);
  // const id = req.params.id * 1;
  // const tour = toursData.find((el) => el.id === id);
  // // if(id>tours.length){
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findone({_id:req.params.id})
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};
// if (!tour) {
//   return res.status(404).json({ status: 'fail', message: 'Invalid' });
// }

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};

// exports.createTour = (req, res) => {
//   // console.log(req.body);

//   const newId = toursData[toursData.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);

//   toursData.push(newTour);

//   fs.writeFile(
//     '/dev-data/data/tours-simple.json',
//     JSON.stringify(newTour),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
//   // res.send('Done');
// };

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      message: error,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          numTourStarts: -1,
        },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: 'Success',
      data: {
        plan,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'Fail',
      message: error,
    });
  }
};
