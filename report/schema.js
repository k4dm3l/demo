'use strict'

const Joi = require('@hapi/joi');

const generateReportSchema = Joi.object().keys({
    allUsers: Joi.boolean().strict().required(),
    format: Joi.string().lowercase().valid('json', 'pdf').allow('', null).strict()
});

module.exports = {
    generateReportSchema
}