const mongoose = require('mongoose');

const otaggggg = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name must be']
    },
    description: {
        type: String,
        required: [true, 'description must be']
    },
    start: {
        type: Date,
        default: Date.now()
    },
    active: {
        type: Boolean,
        default: true
    },
    finish:{
        type:Date
    },
    dereje: {
        type: String,
        required: [true, 'degree must be']
    },
    bellik: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    compNumber: Number
})

const Otag = mongoose.model('Otag', otaggggg);

module.exports = Otag
