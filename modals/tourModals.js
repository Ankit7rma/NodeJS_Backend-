const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      // Unique for not duplicating the same tour with same name
      unique: true,
      trim: true,
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
      maxlength: [40, 'max length 40 '],
      minlength: [10, 'max length 10 '],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a Group size '],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be min 1'],
      max: [5, 'Rating must be min 5'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'a tour must have a price'],
    },
    priceDiscount: {
      // CUSTOME validator or use npm library validator
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price should be less than actual price ',
      },
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    summary: {
      type: String,
      // Trim remove all white space in the begin of the string
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE only runs before .save and .create methods
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Can have multiple pre middlewares or Save hooks
// tourSchema.pre('save', function (next) {
//   console.log('Will save Document');
//   next();
// });
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// /^find/  {regular expression} this will apply to all the queries which starts with find
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query work took ${Date.now() - this.start} miliseconds`);
  // console.log(docs);
  next();
});

// Aggregate middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
{
  // For testing
  // const testTour = new Tour({
  //   name: 'The forest Hiking ',
  //   rating: 4.7,
  //   price: 546,
  // });
  // testTour
  //   .save()
  //   .then((doc) => {
  //     console.log(doc);
  //   })
  //   .catch((error) => console.log('Errorsss🐱‍🏍', error));
}

module.exports = Tour;
