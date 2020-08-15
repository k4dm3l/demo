'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CarrierSchema = new Schema({
    scac: { 
        type: String,
        trim: true,
        uppercase: true,
        required: true,
        unique: true
    },
    carrierId: {
        type: Number,
        required: true,
        unique: true
    },
    name: { 
        type: String,
        trim: true,
        uppercase: true,
        required: true
    },
    mcNumber: { 
        type: String,
        trim: true
    },
    dotNumber: { 
        type: String,
        trim: true
    },
    feinNumber: { 
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Carrier', CarrierSchema);