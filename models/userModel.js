const mongoose = require('mongoose');
const validator = require('validator');
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
        minLength: 8,
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
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;