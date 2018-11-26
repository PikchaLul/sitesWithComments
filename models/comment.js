const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        theme:{
            type: String,
            required: true
        },
        body:{
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: false
    }
);

module.exports = mongoose.model('Comment', schema);