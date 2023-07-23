const mongoose = require('mongoose');

const { Schema } = mongoose;

const charSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    charName: {
        type: String,
        required: true,
    },
    level: {
        type: Number,
        required: true,
    },
    vocation: {
        type: String,
        required: true,
    },
    isPrincipal: {
        type: Boolean,
    },
});

const Char = mongoose.model('Char', charSchema);

module.exports = Char;
