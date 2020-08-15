'use strict'

const mongoose = require('mongoose');
const config = require('../config/config');

const demoDatabaseUrl = `mongodb+srv://${config.noSqlUsername}:${config.noSqlPassword}@${config.noSqlHost}/${config.demoDatabase}`;

module.exports = async (url=demoDatabaseUrl) => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Database connection - Demo-database');
    } catch (error) {
        throw(error);
    }
};