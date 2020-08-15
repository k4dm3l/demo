'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    status: {
        type: String,
        trim: true,
        enum: [
            'pending',
            'generated'
        ],
        required: true,
        lowercase: true
    },
    month: {
        order: Number,
        name: String
    },
    week: Number,
    generationTime: Number,
    driveUrl: String,
    userEmail: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Report', ReportSchema);