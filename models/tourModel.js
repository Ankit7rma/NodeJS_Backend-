/* eslint-disable prefer-arrow-callback */
/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');

const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name '],
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration '],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a maxGroupSize '],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty '],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a Summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a imageCover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// virtual property is that which can be get by existing property cannot be used in query as it is not a part of databse
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Document Middleware - runs only before/after .save() , .create()
// this function is a middleware and we call it as pre save hook

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document ..');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// Query Middleware
tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// Middleware types in mongoose :-
// -Document  - act on curretly processed doc
// -Query
// -Model
// - Aggregate
