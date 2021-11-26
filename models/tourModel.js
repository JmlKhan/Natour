const mongoose = require('mongoose');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"]
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult!'
      } 
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          //this only points to current doc on NEW document creation
          return val < this.price
        },
        message: 'Discount price ({VALUE}) must be lower than price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true,
      select: true
    },
    startLocation: {
      //GeoJson
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
          coordinates: [Number],
          address: String,
          description: String,
          day: Number
      },   
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User' 
      }
    ],
    imageCover: {
      type: String,
      required: [true,'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date],
    secretTour: Boolean,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

  tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
  })

  ////document middleware: runs before: save() and create()
  // tourSchema.pre('save', function(next){
  //   console.log(this)
  //   next();
  // })
        ////embedded data model
  // tourSchema.pre('save', async function(next) {
  //   const guidesPromises = this.guides.map(async id => await User.findById(id));
  //   this.guides = await Promise.all(guidesPromises);

  //   next();
  // })

  //QUERY middleware

  tourSchema.pre('find', function(next){
    this.find({ secretTour: {$ne: true} })
    next();
  });

  tourSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'guides',
      select: '-__v -passwordResetToken'
    });
    next();
  })

  const Tour = mongoose.model('Tour', tourSchema)

  module.exports = Tour;