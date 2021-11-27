const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        trim: true,
        required: [true, 'Review cannot be empty!']
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'Review must belong to tour!']
        },
    user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must have user!']
        },    
},
{
    //virtual properties
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
});

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: '-passwordResetToken -__v'
        
    })
    next();
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;