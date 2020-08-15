'use strict'

const router = require('express').Router();

const userValidation = require('../../utils/middleware/tokenHandler');
const { validateSchema } = require('../../utils/middleware/validationSchema');
const { catchWrapper } = require('../../utils/catchErrors');

const { createOrUpdateSchema, loginSchema, exportReportTypesSchema } = require('./schema');
const { authUser, createUser, generateExport } = require('./controller');

router.post('/auth', validateSchema(loginSchema), catchWrapper(authUser));
router.post('/user', validateSchema(createOrUpdateSchema), catchWrapper(createUser));
router.get('/export', userValidation, validateSchema(exportReportTypesSchema, 'query'), catchWrapper(generateExport));

module.exports = router;