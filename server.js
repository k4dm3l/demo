'use strict'

// Package
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

// Config files
const config = require('./config/config');
const corsConfig = require('./config/cors');
const dbMongoDriver = require('./crud-NoSQL/database');
const dbDemoConnection = require('./demo/database');

// Error handlers
const { notFoundHandler, wrapErrors, errorHandler } = require('./utils/middleware/errorHandlers');

// Init
const app = express();

// Middlewares
app.use(cors(corsConfig));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet());

// Routes
app.use('/', require('./hello-world/router'));
app.use(require('./router'));

// Not found resource handler
app.use(notFoundHandler);

// Error handler middlewares
app.use(wrapErrors);
app.use(errorHandler);

// Start Server
const startServer = async () => {
    try {
        await dbDemoConnection();
        await dbMongoDriver.connectAsync();
        app.listen(config.port, () => {
            console.log(`Server running on http://localhost:${config.port}`);
        });
    } catch (error) {
        process.on('uncaughtException', console.error(error));
        process.on('unhandledRejection', console.error(error));
    }
};

module.exports = { startServer };
