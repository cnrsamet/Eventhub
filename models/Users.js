const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

//Save Password
userSchema.pre('save', async function(next){
    if (!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//Check password
userSchema.methods.validatePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};



const User = mongoose.model('User', userSchema);

module.exports = User;