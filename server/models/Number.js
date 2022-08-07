const mongoose = require('mongoose');

const numberSchema = new mongoose.Schema({
    otag: {
        type: 'String',
        default: 'feruz'
    },
    number: {
        type: Number,
        default: 8
    }
},{timestamps: true});

const NumberComp = mongoose.model('number',numberSchema);

module.exports = NumberComp;