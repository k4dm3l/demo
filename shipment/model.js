'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ShipmentSchema = new Schema({
    carrierId: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    originCountry: { 
        type: String,
        trim: true,
        uppercase: true,
        required: true
    },
    originState: { 
        type: String,
        trim: true,
        uppercase: true,
        required: true
    },
    originCity: { 
        type: String,
        trim: true,
        required: true
    },
    destinationCountry: { 
        type: String,
        trim: true,
        uppercase: true,
        required: true
    },
    destinationState: { 
        type: String,
        trim: true,
        uppercase: true,
        required: true
    },
    destinationCity: { 
        type: String,
        trim: true,
        required: true
    },
    pickupDate: {
        type: Date
    },
    deliveryDate: {
        type: Date
    },
    status: { 
        type: String,
        trim: true,
        required: true
    },
    carrierRate: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Shipment', ShipmentSchema);