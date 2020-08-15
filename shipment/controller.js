'use strict'

const shipmentModel = require('./model');

const { fileShipmentsImportSchema } = require('./schema');

const connectors = require('../connectors.json');
const moment = require('moment');
const boom = require('@hapi/boom');
const xlsx = require('xlsx');
const csvtojson = require('csvtojson');
const streamifier = require('streamifier');

const availableHeaders = [
    'CARRIER ID',
    'DATE',
    'ORIGIN COUNTRY',
    'ORIGIN STATE',
    'ORIGIN CITY',
    'DESTINATION COUNTRY',
    'DESTINATION STATE',
    'DESTINATION CITY',
    'PICKUP DATE',
    'DELIVERY DATE',
    'STATUS',
    'CARRIER RATE'
];

const getShipments = async (req, res) => {
    const shipments = await shipmentModel.find({}).lean().exec();

    if (!shipments) throw boom.badImplementation('Error querying database');
    if (!shipments.length) throw boom.notFound('Any document found');

    res.status(200).json({ message: 'Success', data: shipments });
};

const getShipmentById = async (req, res) => {
    const { id } = req.params;

    const shipment = await shipmentModel.findById(id).lean().exec();

    if (!shipment) throw boom.notFound('Any document found');

    res.status(200).json({ message: 'Success', data: shipment });
};

const getShipmentFilters = async (req, res) => {
    const { q, date } = req.query;
    const page = req.query.page || 1;
    const limit = 50;
    const skip = (page * limit) - limit;

    const queryObject = {
        $or: []
    };

    let wordsArr = q.split(' ');
    wordsArr = wordsArr.filter((word) => {
        if (word !== '') {
            if (!connectors.connectorsSpanish.includes(word.toLowerCase()) && !connectors.connectorsEnglish.includes(word.toLowerCase())) {
                return word;
            }
        }
    });

    connectors.fields.forEach(field => {
        let queryField = {};
        queryField[field] = { $in: wordsArr };
        queryObject['$or'].push(queryField);
    });

    if (date) {
        if (moment(date).isValid()) {
            const formatDate = new Date(moment(date).format('MM-DD-YYYY'));
            queryObject['$or'].push({
                createdAt: {
                    $gte: formatDate
                }
            });
        }
    }

    const shipments = await shipmentModel.find(queryObject).skip(skip).limit(limit).lean().exec();

    if(!shipments.length) throw boom.notFound('Any shipment match with search criteria');
    res.status(200).json({ message: 'Success', queryData: wordsArr, shipments: shipments });
}

const createShipment = async (req, res) => {
    const newShipment = await shipmentModel.create(req.body);

    if (!newShipment) throw boom.badImplementation('Failed on creation process');
    res.status(201).json({ message: 'Success', data: newShipment });
};

const updateShipment = async (req, res) => {
    const { id } = req.params;
    const updatedShipment = await shipmentModel.findOneAndUpdate(
        { _id: id },
        {
            $set: req.body
        },
        {
            new: true
        }
    )
    .lean()
    .exec();

    if (!updatedShipment) throw boom.notFound('Failed on update process');
    res.status(201).json({ message: 'Success', data: updatedShipment })
};

const deleteShipment = async (req, res) => {
    const { id } = req.params;
    const deletedShipment = await shipmentModel.findOneAndDelete({ _id: id }).lean().exec();

    if (!deletedShipment) throw boom.notFound('Failed on delete process');
    res.status(200).json({ message: 'Success', data: deletedShipment });
};

const importShipments = async (req, res) => {
    const bulkInsert = shipmentModel.collection.initializeUnorderedBulkOp();
    const validShipments = [];
    const invalidShipments = [];
    
    let columns = [];
    let validHeaders = false;

    let shipments = [];
    let shipment = {};

    if (req.file.mimetype !== 'text/csv') {
        const workBook = xlsx.read(req.file.buffer);
        const indexSheet = workBook.SheetNames.indexOf('SHIPMENTS');

        if (indexSheet === -1) throw boom.badRequest('The file does not content the SHIPMENTS sheet required');
        const workSheet = workBook.Sheets[workBook.SheetNames[indexSheet]];

        for (let cell in workSheet) {
            const cellAsString = cell.toString();

            if (cellAsString[0] === 'A' && cellAsString !== 'A1') {
                shipment.carrierId = workSheet[cellAsString].v;
            } else if (cellAsString === 'A1') {
                columns.push(workSheet[cellAsString].v);
            }

            if (cellAsString[0] === 'B' && cellAsString !== 'B1') {
                shipment.date = workSheet[cellAsString].v;
            } else if (cellAsString === 'B1') {
                columns.push(workSheet[cellAsString].v);
            }

            if (cellAsString[0] === 'C' && cellAsString !== 'C1') {
                shipment.originCountry = workSheet[cellAsString].v;
            } else if (cellAsString === 'C1') {
                columns.push(workSheet[cellAsString].v);
            }

            if (cellAsString[0] === 'D' && cellAsString !== 'D1') {
                shipment.originState = workSheet[cellAsString].v;
            } else if (cellAsString === 'D1') {
                columns.push(workSheet[cellAsString].v);
            }

            if (cellAsString[0] === 'E' && cellAsString !== 'E1') {
                shipment.originCity = workSheet[cellAsString].v;
            } else if (cellAsString === 'E1') {
                columns.push(workSheet[cellAsString].v);
            }

            if (cellAsString[0] === 'F' && cellAsString !== 'F1') {
                shipment.destinationCountry = workSheet[cellAsString].v;
            } else if (cellAsString === 'F1') {
                columns.push(workSheet[cellAsString].v);
            }

            if (cellAsString[0] === 'G' && cellAsString !== 'G1') {
                shipment.destinationState = workSheet[cellAsString].v;
            } else if (cellAsString === 'G1') {
                columns.push(workSheet[cellAsString].v);
            }

            if (cellAsString[0] === 'H' && cellAsString !== 'H1') {
                shipment.destinationCity = workSheet[cellAsString].v;
            } else if (cellAsString === 'H1') {
                columns.push(workSheet[cellAsString].v);
            }

            if (cellAsString[0] === 'I' && cellAsString !== 'I1') {
                shipment.pickupDate = workSheet[cellAsString].v;
            } else if (cellAsString === 'I1') {
                columns.push(workSheet[cellAsString].v);
            }

            if (cellAsString[0] === 'J' && cellAsString !== 'J1') {
                shipment.deliveryDate = workSheet[cellAsString].v;
            } else if (cellAsString === 'J1') {
                columns.push(workSheet[cellAsString].v);
            }

            if (cellAsString[0] === 'K' && cellAsString !== 'K1') {
                shipment.status = workSheet[cellAsString].v;
            } else if (cellAsString === 'K1') {
                columns.push(workSheet[cellAsString].v);
            }

            if (cellAsString[0] === 'L' && cellAsString !== 'L1') {
                shipment.carrierRate = workSheet[cell].v;
                shipment.row = cellAsString.split('L')[1];
                shipments.push(shipment);
                shipment = {};
            } else if (cellAsString === 'L1') {
                columns.push(workSheet[cellAsString].v);
            }
        }

        columns = columns.sort();
        validHeaders = checkHeadersColumn(availableHeaders.sort(), columns);

        if (!validHeaders) throw boom.badRequest('Please check your file, the columns does not match with the required columns for this operation');

        shipments.forEach((shipment) => {
            const error = checkShipmentInfoError(shipment, fileShipmentsImportSchema);
    
            if (error) {
                invalidShipments.push({ ...shipment, error: error.message });
            } else {
                delete shipment.row;
                validShipments.push(shipment);
                bulkInsert.insert(shipment);
            }
        });

    } else {
        const readable = streamifier.createReadStream(req.file.buffer);
        shipments = await csvtojson().fromStream(readable);

        columns = Object.keys(shipments[0]).sort();
        validHeaders = checkHeadersColumn(availableHeaders.sort(), columns);

        if (!validHeaders) throw boom.badRequest('Please check your file, the columns does not match with the required columns for this operation');

        shipments.forEach((shipment, index) => {
            const mappedShipment = {
                carrierId: shipment['CARRIER ID'],
                date: shipment['DATE'],
                originCountry: shipment['ORIGIN COUNTRY'],
                originState: shipment['ORIGIN STATE'],
                originCity: shipment['ORIGIN CITY'],
                destinationCountry: shipment['DESTINATION COUNTRY'],
                destinationState: shipment['DESTINATION STATE'],
                destinationCity: shipment['DESTINATION CITY'],
                pickupDate: shipment['PICKUP DATE'],
                deliveryDate: shipment['DELIVERY DATE'],
                status: shipment['STATUS'],
                carrierRate: Number(shipment['CARRIER RATE']) | 0,
                row: String(index + 1)
            }
            const error = checkShipmentInfoError(mappedShipment, fileShipmentsImportSchema);

            if (error) {
                invalidShipments.push({ ...mappedShipment, error: error.message });
            } else {
                delete mappedShipment.row;
                validShipments.push(mappedShipment);
                bulkInsert.insert(mappedShipment);
            }
        });
    }

    if (!bulkInsert.length) throw boom.badRequest('No available shipments to insert');

    const resultInsert = await bulkInsert.execute();
    const response = {
        message: 'Success',
        data: {
            shipmentsInserted: resultInsert.nInserted  || 0,
            shipmentWithError: invalidShipments.length ?
                                invalidShipments :
                                []
        }
    };

    res.status(201).json(response);
}

const checkShipmentInfoError = (shipment, schema) => {
    const { error } = schema.validate(shipment);
    if (error) return error;
    return null;
};

const checkHeadersColumn = (availableH, columns) => {
    return Array.isArray(availableH) && Array.isArray(columns)
            && availableH.length === columns.length
            && availableH.every((value, index) => value === columns[index]);
}

module.exports = {
    getShipments,
    getShipmentById,
    createShipment,
    updateShipment,
    deleteShipment,
    getShipmentFilters,
    importShipments
};