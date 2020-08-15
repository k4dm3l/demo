'use strict'

const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const searchByIdSchema = Joi.object().keys({
    id: Joi.objectId()
});

const createOrUpdateSchema = Joi.object().keys({
	scac: Joi.string().trim().alphanum().required(),
    carrierId: Joi.number().integer().positive().strict().required(),
    name: Joi.string().trim().required(),
    mcNumber: Joi.string().trim().allow(''),
    dotNumber: Joi.string().trim().allow(''),
    feinNumber: Joi.string().trim().allow('')
});

module.exports = {
    searchByIdSchema,
    createOrUpdateSchema
}