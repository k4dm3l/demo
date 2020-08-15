'use strict'

const router = require('express').Router();

const roleValidation = require('../../utils/middleware/tokenHandler');
const { validateSchema } = require('../../utils/middleware/validationSchema');
const { catchWrapper } = require('../../utils/catchErrors');
const { receiveFile } = require('../../utils/fileHandler');

const { createOrUpdateSchema, searchByIdSchema } = require('./schema');
const { getCarriers, getCarrierById, createCarrier, updateCarrier, deleteCarrier, importCarriers } = require('./controller');

router.get('/carrier', roleValidation, catchWrapper(getCarriers));
router.get('/carrier/:id', roleValidation, validateSchema(searchByIdSchema, 'params'), catchWrapper(getCarrierById));
router.post('/carrier-import', receiveFile, catchWrapper(importCarriers));
router.post('/carrier', roleValidation, validateSchema(createOrUpdateSchema), catchWrapper(createCarrier));
router.put('/carrier/:id', roleValidation, validateSchema(searchByIdSchema, 'params'), validateSchema(createOrUpdateSchema), catchWrapper(updateCarrier));
router.delete('/carrier/:id', roleValidation, validateSchema(searchByIdSchema, 'params'), catchWrapper(deleteCarrier));

module.exports = router;