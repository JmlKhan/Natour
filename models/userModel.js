const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    passwordChangeAt: Date
});

userSchema.pre('save', async function(next) {
    //only run this function if password was actually modified
    if(!this.isModified('password')) return next();
    //HASH the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changesPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangeAt) {
        const changedTimestamp = parseInt(this.passwordChangeAt.getTime()/1000,10);
        
        return JWTTimestamp < changedTimestamp;
    }

    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;