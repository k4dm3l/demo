'use strict'

const userModel = require('./model');
const shipmentModel = require('../shipment/model');

const { sendEmailReport } = require('../../utils/mailer');
const { encryptPassword } = require('../../utils/crypter');
const config = require('../../config/config');
const Jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');
const json2csv = require('json2csv').parseAsync;
const axios = require('axios');
const moment = require('moment');

const { createAuditReportInfo, updateAuditReportInfo } = require('../report/controller');
const { listFiles, uploadFile, createFolder } = require('../../utils/googleDriveHandler');

const authUser = async (req, res) => {
    const { username, password } = req.body;
    
    const user = await userModel.findOne({ username: username, password: password }).lean().exec();

    if (!user) throw boom.unauthorized('Not valid credentials');
    
    const token = Jwt.sign(user, config.jwtAuthSecret, { expiresIn: config.jwtExpireTime });
    res.status(200).json({...user, token: token});
};

const createUser = async (req, res) => {
    const { username, role, email } = req.body;
    let password = req.body.password;

    password = await encryptPassword(password);
    const newUser = await userModel.create({ username, password, role, email });

    if (!newUser) throw boom.badImplementation('Error on user creation process');
    res.status(201).json(newUser);
};

const generateExport = async (req, res) => {
    let { type } = req.query;
    let upload = '';
    let seriesForReport = [];
    const eiaRequestPromises = [];
    const date = new Date();
    const fileName = `${date.getFullYear()}${date.getMonth()+1}${date.getDate()}${date.getMinutes()}`;

    const newReportAuditInfo = await createAuditReportInfo(res.locals.email);
    const pricesEIASeries = await getWeeklySeries(); 

    if (!type) {
        type = 'xls';
    }

    const result = await shipmentModel.aggregate([
        {
            $lookup: {
                from: 'carriers',
                localField: 'carrierId',
                foreignField: 'carrierId',
                as: 'carrierInfo'
            }
        },
        {
            $unwind: {
                path: '$carrierInfo'
            }
        },
        {
            $facet: {
                averages: [
                    {
                        $group: {
                          _id: '$$ROOT.carrierInfo.scac',
                          averageCarrierRate: {
                            $avg: '$$ROOT.carrierRate'
                          }
                        }
                    }
                ],
                shipments: [
                    {
                        $group: {
                            _id: {
                                carrierName: '$$ROOT.carrierInfo.name',
                                scac: '$$ROOT.carrierInfo.scac',
                                status: '$$ROOT.status',
                                originCity: '$$ROOT.originCity',
                                deliveryDate: '$$ROOT.deliveryDate'
                            },
                            pickupDate: { $first: '$$ROOT.pickupDate' },
                            count: { $sum: 1  },
                            averageCarrierRate: {
                                $avg: '$$ROOT.carrierRate'
                            },
                            totalCarrier: { $sum: '$$ROOT.carrierRate' }
                        }
                    }
                ]
            }
        }
    ]);

    pricesEIASeries.forEach(serie => {
        let cityNameSerie = serie.name.split(',')[0];
        result[0].shipments.find(shipment => {
            if (shipment._id.originCity.toLowerCase() === cityNameSerie) {
                seriesForReport.push(serie);
            }
        });
    });

    seriesForReport = [ ...new Set(seriesForReport)];
    seriesForReport.push({
        series_id: 'PET.EMM_EPMRU_PTE_NUS_DPG.W',
        name: 'U.S. Regular Conventional Retail Gasoline Prices, Weekly'
    });

    seriesForReport.forEach(serie => {
        eiaRequestPromises.push(getSeriePrices(serie.series_id));
    })

    const weeklyPricesBySeries = await Promise.all(eiaRequestPromises);

    result[0].shipments.map(shipment => {
        shipment['CARRIER NAME'] = shipment._id.carrierName;
        shipment['CARRIER SCAC'] = shipment._id.scac;
        shipment['STATUS'] = shipment._id.status;
        shipment['ORIGIN CITY'] = shipment._id.originCity;
        shipment['PICKUP DATE'] = shipment.pickupDate ? shipment.pickupDate : ' ';
        shipment['DELIVERY DATE'] = shipment._id.deliveryDate ? shipment._id.deliveryDate : ' ';
        shipment['TOTAL CARRIER PRICE'] = shipment.totalCarrier;
        shipment['COUNT GROUP SHIPMENT'] = shipment.count;
        shipment['AVERAGE CARRIER PRICE'] = shipment.averageCarrierRate;

        let priceByCity = weeklyPricesBySeries.find(weeklySerie => weeklySerie.series[0].name === shipment._id.originCity.toLowerCase());

        if (priceByCity) {
            if (shipment.pickupDate) {
                const dataWithCity = priceByCity.series[0].data.find(objPrice => new Date(objPrice.date) < new Date(shipment.pickupDate));
                shipment['REGULAR CONVENTIONAL RETAIL GASOLINE PRICES PER GALLON (From www.eia.gov)'] = dataWithCity.price;
            } else {
                shipment['REGULAR CONVENTIONAL RETAIL GASOLINE PRICES PER GALLON (From www.eia.gov)'] = priceByCity.series[0].data[0].price;
            }
        } else {
            if (shipment.pickupDate) {
                const dataWithoutCity = weeklyPricesBySeries[weeklyPricesBySeries.length - 1].series[0].data.find(objPrice => new Date(objPrice.date) < new Date(shipment.pickupDate));
                shipment['REGULAR CONVENTIONAL RETAIL GASOLINE PRICES PER GALLON (From www.eia.gov)'] = dataWithoutCity.price
            } else {
                shipment['REGULAR CONVENTIONAL RETAIL GASOLINE PRICES PER GALLON (From www.eia.gov)'] = weeklyPricesBySeries[weeklyPricesBySeries.length - 1].series[0].data[0].price;
            }
        }

        delete shipment._id;
        delete shipment.totalCarrier;
        delete shipment.count;
        delete shipment.averageCarrierRate;
    });

    const buffer = Buffer.from(await json2csv(result[0].shipments, 
        { 
            fields: [
                'CARRIER NAME',
                'CARRIER SCAC',
                'STATUS',
                'ORIGIN CITY',
                'PICKUP DATE',
                'DELIVERY DATE',
                'TOTAL CARRIER PRICE',
                'COUNT GROUP SHIPMENT',
                'AVERAGE CARRIER PRICE',
                'REGULAR CONVENTIONAL RETAIL GASOLINE PRICES PER GALLON (From www.eia.gov)'
            ]
        }
    ));

    let folderIdParent = '';
    const folderList = await listFiles(config.googleDrivePublicFolder);
    const folderInfo = folderList.find(folder => folder.name === res.locals.username);

    if (folderInfo) {
        folderIdParent = folderInfo.id;
    } else {
        const newFolder = await createFolder(res.locals.username);
        folderIdParent = newFolder.id;
    }
    
    if (type === 'csv') {
        upload = await uploadFile(buffer, 'text/csv', fileName, folderIdParent);
    } else {
        upload = await uploadFile(buffer, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileName, folderIdParent);
    }

    const finishDate = new Date();
    const diffTime = date.getTime() - finishDate.getTime();
    const generationTime = Math.abs(diffTime / 1000);
    const fileUrl = `${config.driveFilePathBase}${upload.id}/view?usp=sharing`;

    await updateAuditReportInfo(newReportAuditInfo._id, fileUrl, generationTime);

    sendEmailReport(res.locals.email, `${config.driveUrl}${upload.id}`);
    res.status(200).json({ message: 'Success', data: `An email with the report drive URL was sent to ${res.locals.email}`});
};

const getWeeklySeries = async () => {
    const apiUrl = `${config.eiaUrlPathBase}/category/?api_key=${config.eiaApiKey}&category_id=241123`;
    
    const { data } = await axios.get(apiUrl);

    if (!data) throw boom.badImplementation('No EIA API response, please contact support');
    if (!data.category.childseries.length) throw boom.notFound('No prices found');

    const weeklyPriceSeries = data.category.childseries.filter(serie => {
        if (serie.f === 'W') {
            delete serie.f
            return serie;
        }
    });

    weeklyPriceSeries.map(serie => {
        serie.name = serie.name.split('Regular')[0].trim().toLowerCase();
    });

    if (!weeklyPriceSeries.length) throw boom.notFound('No weekly prices found');
    return weeklyPriceSeries;
};

const getSeriePrices = async (serieId) => {
    const apiUrl = `${config.eiaUrlPathBase}/series/?api_key=${config.eiaApiKey}&series_id=${serieId}`;

    const { data } = await axios.get(apiUrl);
    if (data.data && data.data.error) throw boom.badRequest(data.data.error);

    delete data.request;

    data.series.map(async dataSerie => {
        delete dataSerie.series_id;
        delete dataSerie.unitsshort;
        delete dataSerie.copyright;
        delete dataSerie.geography;
        delete dataSerie.f;
        delete dataSerie.start;
        delete dataSerie.end;

        dataSerie.name = dataSerie.name.split(' ')[0].split(',')[0].toLowerCase();
        dataSerie.data = dataSerie.data.map(priceWeek =>  { return { date: moment(priceWeek[0], 'YYYYMMDD').format(), price: priceWeek[1] } });
    });

    return data;
};

module.exports = {
    authUser,
    createUser,
    generateExport
}