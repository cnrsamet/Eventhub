const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const tokenBlacklistSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600  // 10 dakika sonra token kaydı otomatik olarak silinecek
    }
});

const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);

module.exports = TokenBlacklist;
