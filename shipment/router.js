'use strict'

const router = require('express').Router();

const roleValidation = require('../../utils/middleware/tokenHandler');
const { validateSchema } = require('../../utils/middleware/validationSchema');
const { catchWrapper } = require('../../utils/catchErrors');
const { receiveFile } = require('../../utils/fileHandler');

const { createOrUpdateSchema, searchByIdSchema, querySchema } = require('./schema');
const { getShipments, getShipmentById, createShipment, updateShipment, deleteShipment, getShipmentFilters, importShipments } = require('./controller');

router.get('/shipment', roleValidation, catchWrapper(getShipments));
router.get('/shipment/:id', roleValidation, validateSchema(searchByIdSchema, 'params'), catchWrapper(getShipmentById));
router.get('/shipment-filters', roleValidation, validateSchema(querySchema, 'query'), catchWrapper(getShipmentFilters));
router.post('/shipment', roleValidation, validateSchema(createOrUpdateSchema), catchWrapper(createShipment));
router.post('/shipment-import', roleValidation, receiveFile, catchWrapper(importShipments));
router.put('/shipment/:id', roleValidation, validateSchema(searchByIdSchema, 'params'), validateSchema(createOrUpdateSchema), catchWrapper(updateShipment));
router.delete('/shipment/:id', roleValidation, validateSchema(searchByIdSchema, 'params'), catchWrapper(deleteShipment));

module.exports = router;