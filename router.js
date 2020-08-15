'use strict'

const path = require('path');
const express = require('express');

const serverRoutes = express();

serverRoutes.use('/sql', express.static(path.join(__dirname, 'crud-SQL/public')));

serverRoutes.use('/sql', require('./crud-SQL/account/router'));
serverRoutes.use('/sql', require('./crud-SQL/carrier/router'));
serverRoutes.use('/sql', require('./crud-SQL/company/router'));
serverRoutes.use('/sql', require('./crud-SQL/contract/router'));
serverRoutes.use('/sql', require('./crud-SQL/accessorial/router'));
serverRoutes.use('/sql', require('./crud-SQL/user/router'));
serverRoutes.use('/sql', require('./crud-SQL/user-company/router'));
serverRoutes.use('/sql', require('./crud-SQL/quote/router'));
serverRoutes.use('/sql', require('./crud-SQL/item/router'));
serverRoutes.use('/sql', require('./crud-SQL/quote-accessorial/router'));
serverRoutes.use('/sql', require('./crud-SQL/rate/router'));
serverRoutes.use('/sql', require('./crud-SQL/rate-accessorial/router'));
serverRoutes.use('/sql', require('./crud-SQL/shipment/router'));
serverRoutes.use('/sql', require('./crud-SQL/shipment-reference/router'));
serverRoutes.use('/sql', require('./crud-SQL/tracking/router'));
serverRoutes.use('/sql', require('./crud-SQL/document/router'));

serverRoutes.use('/no-sql', express.static(path.join(__dirname, 'crud-NoSQL/public')));

serverRoutes.use('/no-sql', require('./crud-NoSQL/account/router'));
serverRoutes.use('/no-sql', require('./crud-NoSQL/accessorial/router'));
serverRoutes.use('/no-sql', require('./crud-NoSQL/carrier/router'));
serverRoutes.use('/no-sql', require('./crud-NoSQL/contract/router'));
serverRoutes.use('/no-sql', require('./crud-NoSQL/company/router'));
serverRoutes.use('/no-sql', require('./crud-NoSQL/user/router'));
serverRoutes.use('/no-sql', require('./crud-NoSQL/quote/router'));
serverRoutes.use('/no-sql', require('./crud-NoSQL/rate/router'));
serverRoutes.use('/no-sql', require('./crud-NoSQL/shipment/router'));
serverRoutes.use('/no-sql', require('./crud-NoSQL/tracking/router'));
serverRoutes.use('/no-sql', require('./crud-NoSQL/document/router'));

serverRoutes.use('/eia', require('./us-energy-information-admin/router'));

serverRoutes.use('/demo', require('./demo/carrier/router'));
serverRoutes.use('/demo', require('./demo/shipment/router'));
serverRoutes.use('/demo', require('./demo/user/router'));
serverRoutes.use('/demo', require('./demo/report/router'));

module.exports = serverRoutes;