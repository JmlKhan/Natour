const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User must have a name!'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'User must have email!'],
        unique: true,
        lowecase: true,
        validate: [validator.isEmail, 'Please, provide a valid email'],
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'User must have password'],
        minLength: 6,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Password are not the same!'
        }
    },
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
});

// userSchema.pre('save', async function(next) {
//     //only run this function if password was actually modified
//     if(!this.isModified('password')) return next();
//     //HASH the password with cost of 12
//     this.password = await bcrypt.hash(this.password, 12);
//     this.passwordConfirm = undefined;
//     next();
// });

// userSchema.pre('save',  function(next) {
//     if(!this.isModified('password') || this.isNew) return next();
    
//     this.passwordChangeAt = Date.now() - 1000;
//     next();
// });
// userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
//     return await bcrypt.compare(candidatePassword, userPassword)
// }

// userSchema.methods.changesPasswordAfter = function(JWTTimestamp) {
//     if(this.passwordChangeAt) {
//         const changedTimestamp = parseInt(this.passwordChangeAt.getTime()/1000,10);
        
//         return JWTTimestamp < changedTimestamp;
//     }
//     return false;
// };

// userSchema.pre('find', function(next) {
//     //this points to the current query

//     this.find({ active: {$ne: false} });
//     next();
// })

// userSchema.methods.createPasswordResetToken = function() {
//     const resetToken = crypto.randomBytes(32).toString('hex');

//    this.passwordResetToken = crypto
//    .createHash('sha256')
//    .update(resetToken)
//    .digest('hex');

//    console.log({resetToken}, this.passwordResetToken);

//    this.passwordResetExpires  =Date.now() + 10 * 60 * 1000;

//    return resetToken;
// }

const User = mongoose.model('User', userSchema);

module.exports = User;