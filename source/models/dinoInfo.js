const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dinoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    codeName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    survival: {
        type: Boolean,
        required: true
    },
    tier: {
        type: Number,
        required: true
    },
    diet: {
        type: String,
        required: true
    }
});

const DinoInfo = mongoose.model('DinoInfo', dinoSchema);

module.exports = DinoInfo;