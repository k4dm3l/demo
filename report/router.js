'use strict'

const router = require('express').Router();

const roleValidation = require('../../utils/middleware/tokenHandler');
const { catchWrapper } = require('../../utils/catchErrors');
const { validateSchema } = require('../../utils/middleware/validationSchema');

const { generateReportSchema } = require('./schema');
const { generateReport } = require('./controller');

router.get('/status', roleValidation, validateSchema(generateReportSchema), catchWrapper(generateReport));

module.exports = router;