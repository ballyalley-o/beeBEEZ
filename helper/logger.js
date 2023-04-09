require('colors');
require('dotenv').config();

exports.serverLog = `SERVER PORT: ${process.env.PORT}...`.blue.inverse;
exports.DATABASE = ` ${process.env.MONGODB_DB} `.bgMagenta ;
exports.logMsg = `STATUS: `;
exports.status1 = ` CONNECTED `.green.inverse;
exports.status2 = ` FAILED `.red.inverse;




// const morgan = require('morgan')
// const express = require('express')

// const app = express()

// app.use(morgan('combined'))

// //create a morgan logger middleware
// module.exports = logger = morgan(function (tokens, req, res) {
//     return [
//         tokens.method(req, res),
//         tokens.url(req, res),
//         tokens.status(req, res),
//         tokens.res(req, res, 'content-length'), '-',
//         tokens['response-time'](req, res), 'ms'
//     ].join(' ')
//     }
// )


