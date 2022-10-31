const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema( {
    discordId: {
        type: String,
        required: true
    },
    steamId: {
        type: String,
        required: true
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;