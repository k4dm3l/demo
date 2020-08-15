'use strict'

const carrierModel = require('./model');

const boom = require('@hapi/boom');
const streamifier = require('streamifier');
const csvtojson = require('csvtojson');

const getCarriers = async (req, res) => {
    const carriers = await carrierModel.find({}).lean().exec();

    if (!carriers) throw boom.badImplementation('Error querying database');
    if (!carriers.length) throw boom.notFound('Any document found');

    res.status(200).json({ message: 'Success', data: carriers });
};

const getCarrierById = async (req, res) => {
    const { id } = req.params;

    const carrier = await carrierModel.findById(id).lean().exec();

    if (!carrier) throw boom.notFound('Any document found');

    res.status(200).json({ message: 'Success', data: carrier });
};

const createCarrier = async (req, res) => {
    const newCarrier = await carrierModel.create(req.body);

    if (!newCarrier) throw boom.badImplementation('Failed on creation process');
    res.status(201).json({ message: 'Success', data: newCarrier });
};

const updateCarrier = async (req, res) => {
    const { id } = req.params;
    const updatedCarrier = await carrierModel.findOneAndUpdate(
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

    if (!updatedCarrier) throw boom.notFound('Failed on update process');
    res.status(201).json({ message: 'Success', data: updatedCarrier })
};

const deleteCarrier = async (req, res) => {
    const { id } = req.params;
    const deletedCarrier = await carrierModel.findOneAndDelete({ _id: id }).lean().exec();

    if (!deletedCarrier) throw boom.notFound('Failed on delete process');
    res.status(200).json({ message: 'Success', data: deletedCarrier });
};

const importCarriers = async (req, res) => {
    const bulkInsert = carrierModel.collection.initializeUnorderedBulkOp();

    if (req.file.mimetype !== 'text/csv') throw boom.badRequest('Not type file allowed');
    const readable = streamifier.createReadStream(req.file.buffer);
    const carriers = await csvtojson().fromStream(readable);

    carriers.forEach(carrier => {
        const mappedCarrier = {
            scac: carrier.SCAC,
            carrierId: Number(carrier.ID),
            name: carrier.NAME,
            mcNumber: carrier.MC,
            dotNumber: carrier.DOT,
            feinNumber: carrier.FEIN
        };

        bulkInsert.insert(mappedCarrier);
    });

    const resultInsert = await bulkInsert.execute();
    res.status(200).json({ data: carriers, result: resultInsert });
}

module.exports = {
    getCarriers,
    getCarrierById,
    createCarrier,
    updateCarrier,
    deleteCarrier,
    importCarriers
};