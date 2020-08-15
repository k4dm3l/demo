'use strict'

const Joi = require('@hapi/joi');

const loginSchema = Joi.object().keys({
    username: Joi.string().trim().alphanum().required(),
    password: Joi.string().trim().required()
});

const createOrUpdateSchema = Joi.object().keys({
    username: Joi.string().trim().alphanum().required(),
    password: Joi.string().trim().required(),
    role: Joi.string().valid('admin', 'readonly').required(),
    email: Joi.string().email().required()
});

const exportReportTypesSchema = Joi.object().keys({
    type: Joi.string().trim().valid('csv', 'xls').allow('', null)
});

module.exports = {
    loginSchema,
    createOrUpdateSchema,
    exportReportTypesSchema
};