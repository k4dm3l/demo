'use strict'

const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const querySchema = Joi.object().keys({
    q: Joi.string().trim(),
    date: Joi.string().regex(/^[0-9]*$/).max(8).allow('', null),
    page: Joi.string().regex(/^[0-9]*$/).allow('', null)
});

const searchByIdSchema = Joi.object().keys({
    id: Joi.objectId()
});

const createOrUpdateSchema = Joi.object().keys({
    carrierId: Joi.number().integer().positive().required(),
    date: Joi.string().required(),
    originCountry: Joi.string().uppercase().trim().max(3).required(),
    originState: Joi.string().uppercase().trim().max(2).required(),
    originCity: Joi.string().trim().required(),
    destinationCountry: Joi.string().uppercase().trim().max(3).required(),
    destinationState: Joi.string().uppercase().trim().max(2).required(),
    destinationCity: Joi.string().trim().required(),
    pickupDate: Joi.string().trim().allow(''),
    deliveryDate: Joi.string().trim().allow(''),
    status: Joi.string().trim().required(),
    carrierRate: Joi.number().strict().required()
});

const fileShipmentsImportSchema = Joi.object().keys({
    carrierId: Joi.number().integer().positive().required(),
    date: Joi.string().required(),
    originCountry: Joi.string().uppercase().trim().max(3).required(),
    originState: Joi.string().uppercase().trim().max(2).required(),
    originCity: Joi.string().trim().required(),
    destinationCountry: Joi.string().uppercase().trim().max(3).required(),
    destinationState: Joi.string().uppercase().trim().max(2).required(),
    destinationCity: Joi.string().trim().required(),
    pickupDate: Joi.string().trim().allow(''),
    deliveryDate: Joi.string().trim().allow(''),
    status: Joi.string().trim().required(),
    carrierRate: Joi.number().strict().required(),
    row: Joi.string()
});

module.exports = {
    searchByIdSchema,
    createOrUpdateSchema,
    fileShipmentsImportSchema,
    querySchema
}