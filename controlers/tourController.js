const fs = require('fs');
const Tour = require('./../modals/tourModals');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

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

exports.getAllTours = catchAsync(async (req, res, next) => {
  // console.log(req.requestedTime);
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
});

exports.getTour = catchAsync(async (req, res, next) => {
  // console.log(req.params);
  // const id = req.params.id * 1;
  // const tour = toursData.find((el) => el.id === id);
  // // if(id>tours.length){

  const tour = await Tour.findById(req.params.id);
  // Tour.findone({_id:req.params.id})
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
// if (!tour) {
//   return res.status(404).json({ status: 'fail', message: 'Invalid' });
// }

// const catchAsync = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch((err) => next(err));
//   };
// };

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
  // try {
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'Fail',
  //     message: err,
  //   });
  // }
});

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

exports.updateTour = catchAsync(async (req, res, next) => {
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
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
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
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
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
});
