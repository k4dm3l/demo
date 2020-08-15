'use strict'

const reportModel = require('./model');

const fs = require('fs');
const util = require('util');
const path = require('path');
const hb = require('handlebars');
const puppeter = require('puppeteer');
const boom = require('@hapi/boom');

const config = require('../../config/config');
const { listFiles, uploadFile } = require('../../utils/googleDriveHandler');

const readFile = util.promisify(fs.readFile);
const templatePath = path.join(__dirname, 'template.hbs');

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const generateReport = async (req, res) => {
    const { allUsers, format } = req.body;
    const { email, role } = res.locals;

    const date = new Date();
    const fileName = `REPORT-${date.getFullYear()}${date.getMonth()+1}${date.getDate()}${date.getMinutes()}`;

    const query = {
        totalGenerated: [],
        totalPending: [],
        averageGeneration: [],
        reportByMonth: [],
        reportByWeek: [],
        reportsByUser: []
    };

    if (role === 'ADMIN' && allUsers) {
        query.totalGenerated.push({ '$match': { status: 'generated' } });
        query.totalGenerated.push({ '$group': { _id: '$$ROOT.userEmail', count: { $sum: 1 } } });

        query.totalPending.push({ '$match': { status: 'pending' } });
        query.totalPending.push({ '$group': { _id: '$$ROOT.userEmail', count: { $sum: 1 } } });

        query.averageGeneration.push({ '$match':{} });
        query.averageGeneration.push({ '$group':{ _id: '$$ROOT.userEmail', average: { $avg:'$$ROOT.generationTime' } } });

        query.reportByMonth.push({ '$match':{} });
        query.reportByMonth.push({ '$group': { _id: '$$ROOT.month.name', count: { $sum: 1 } } });

        query.reportByWeek.push({ '$match':{} });
        query.reportByWeek.push({ '$group': { _id: '$$ROOT.week', count: { $sum: 1 } } });

        query.reportsByUser.push({ '$match':{} });
        query.reportsByUser.push({
            '$project': {
              'startDate': '$$ROOT.createdAt',
              'endDate': '$$ROOT.updatedAt',
              'status': '$$ROOT.status',
              'link': '$$ROOT.driveUrl'
            }
        });
    } else {
        if (role === 'ADMIN' && !allUsers) {
            query.totalGenerated.push({ '$match': { userEmail: email, status: 'generated' } });
            query.totalGenerated.push({ '$group': { _id: '$$ROOT.userEmail', count: { $sum: 1 } } });

            query.totalPending.push({ '$match': { userEmail: email, status: 'pending' } });
            query.totalPending.push({ '$group': { _id: '$$ROOT.userEmail', count: { $sum: 1 } } });

            query.averageGeneration.push({ '$match':{ userEmail: email } });
            query.averageGeneration.push({ '$group':{ _id: '$$ROOT.userEmail', average: { $avg:'$$ROOT.generationTime' } } });

            query.reportByMonth.push({ '$match':{ userEmail: email } });
            query.reportByMonth.push({ '$group': { _id: '$$ROOT.month.name', count: { $sum: 1 } } });

            query.reportByWeek.push({ '$match':{ userEmail: email } });
            query.reportByWeek.push({ '$group': { _id: '$$ROOT.week', count: { $sum: 1 } } });

            query.reportsByUser.push({ '$match':{ userEmail: email } });
            query.reportsByUser.push({
                '$project': {
                'startDate': '$$ROOT.createdAt',
                'endDate': '$$ROOT.updatedAt',
                'status': '$$ROOT.status',
                'link': '$$ROOT.driveUrl'
                }
            });
        } else {
            if (role !== 'ADMIN') {
                query.totalGenerated.push({ '$match': { userEmail: email, status: 'generated' } });
                query.totalGenerated.push({ '$group': { _id: '$$ROOT.userEmail', count: { $sum: 1 } } });

                query.totalPending.push({ '$match': { userEmail: email, status: 'pending' } });
                query.totalPending.push({ '$group': { _id: '$$ROOT.userEmail', count: { $sum: 1 } } });

                query.averageGeneration.push({ '$match':{ userEmail: email } });
                query.averageGeneration.push({ '$group':{ _id: '$$ROOT.userEmail', average: { $avg:'$$ROOT.generationTime' } } });

                query.reportByMonth.push({ '$match':{ userEmail: email } });
                query.reportByMonth.push({ '$group': { _id: '$$ROOT.month.name', count: { $sum: 1 } } });

                query.reportByWeek.push({ '$match':{ userEmail: email } });
                query.reportByWeek.push({ '$group': { _id: '$$ROOT.week', count: { $sum: 1 } } });

                query.reportsByUser.push({ '$match':{ userEmail: email } });
                query.reportsByUser.push({
                    '$project': {
                    'startDate': '$$ROOT.createdAt',
                    'endDate': '$$ROOT.updatedAt',
                    'status': '$$ROOT.status',
                    'link': '$$ROOT.driveUrl'
                    }
                });
            }
        }
    }

    const result = await reportModel.aggregate([
        {
            $facet: query
        }
    ]);

    const resultOneUser = {};

    if (format === 'json') {
        if (!allUsers) {
            resultOneUser['totalGenerated'] = result[0].totalGenerated[0].count;
            resultOneUser['totalPending'] = result[0].totalPending[0].count;
            resultOneUser['averageGeneration'] = result[0].averageGeneration[0].count;
            resultOneUser['reportByMonth'] = result[0].reportByMonth;
            resultOneUser['reportByWeek'] = result[0].reportByWeek;
            resultOneUser['reportsByUser'] = result[0].reportsByUser;

            res.status(200).json({ message: '', data: resultOneUser });
        } else {
            res.status(200).json({ message: '', data: result });
        }    
    } else {
        let renderTemplate = '';
        let template = await readFile(templatePath, 'utf8');

        if (!allUsers) {
            resultOneUser['totalGenerated'] = result[0].totalGenerated[0].count;
            resultOneUser['totalPending'] = result[0].totalPending[0].count;
            resultOneUser['averageGeneration'] = result[0].averageGeneration[0].average;
            resultOneUser['reportByMonth'] = result[0].reportByMonth;
            resultOneUser['reportByWeek'] = result[0].reportByWeek;
            resultOneUser['reportsByUser'] = result[0].reportsByUser;

            renderTemplate = hb.compile(template)({
                userEmail: email,
                totalGenerated: resultOneUser.totalGenerated,
                totalPending: resultOneUser.totalPending,
                averageGeneration: secondsToMinutes(resultOneUser.averageGeneration),
                reportByMonth: resultOneUser.reportByMonth,
                reportByWeek: resultOneUser.reportByWeek,
                reportsByUser: resultOneUser.reportsByUser
            })
        } else {
            renderTemplate = hb.compile(template, { strict: true })({
                userEmail: result[0].userEmail,
                totalGenerated: result[0].totalGenerated,
                totalPending: result[0].totalPending,
                averageGeneration: result[0].averageGeneration,
                reportByMonth: result[0].reportByMonth,
                reportByWeek: result[0].reportByWeek,
                reportsByUser: result[0].reportsByUser
            });
        }

        const browser = await puppeter.launch();
        const page = await browser.newPage();
        await page.setContent(renderTemplate);

        const pdfBuffer = await page.pdf();
        await browser.close();

        let folderIdParent = '';
        const folderList = await listFiles(config.googleDrivePublicFolder);
        const folderInfo = folderList.find(folder => folder.name === res.locals.username);

        if (folderInfo) {
            folderIdParent = folderInfo.id;
        } else {
            const newFolder = await createFolder(res.locals.username);
            folderIdParent = newFolder.id;
        }

        const upload = await uploadFile(pdfBuffer, 'application/pdf', fileName, folderIdParent);
        const fileUrl = `${config.driveFilePathBase}${upload.id}/view?usp=sharing`;

        res.status(200).json({
            message: 'Success',
            data: {
                downloadLink: fileUrl
            }
        });
    }
};

const createAuditReportInfo = async (userEmail) => {
    const date = new Date();
    const payload = {
        status: 'pending',
        month: {
            order: date.getMonth()+1,
            name: monthNames[date.getMonth()]
        },
        week: getWeekInMonth(date),
        generationTime: 0,
        driveUrl: '',
        userEmail: userEmail
    };

    const newReport = await reportModel.create(payload);
    if (!newReport) throw boom.badImplementation('Failed on audit creation process register');

    return newReport;
};

const updateAuditReportInfo = async (reportId, driveUrl, generationTime) => {
    const updatedReport = await reportModel.findOneAndUpdate(
        { _id: reportId },
        {
            $set: {
                status: 'generated',
                generationTime: generationTime,
                driveUrl: driveUrl
            }
        }
    )
    .lean()
    .exec();
    if (!updatedReport) throw boom.badImplementation('Error updating report');
    return;
};

const getWeekInMonth = (date) => {
    date.setDate(date.getDate() - date.getDay() + 1);
    const week = Math.ceil(date.getDate()/7);
    return week;
};

const secondsToMinutes = (seconds) => {
    let minutes = Math.floor((seconds/60) % 60);
    if (minutes > 0) return `${minutes} minute(s)`;
    return `${seconds} seconds`
}

module.exports = {
    generateReport,
    createAuditReportInfo,
    updateAuditReportInfo
}