'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        trim: true,
        uppercase: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);