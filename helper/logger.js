require('colors');
require('dotenv').config();

exports.serverLog = `SERVER PORT: ${process.env.PORT}...`.blue.inverse;
exports.DATABASE = ` ${process.env.MONGODB_DB} `.bgMagenta ;
exports.logMsg = `STATUS: `;
exports.status1 = ` CONNECTED `.green.inverse;
exports.status2 = ` FAILED `.red.inverse;
exports.envMode = `ENVIRONMENT: ${process.env.NODE_ENV}...`.yellow.inverse;




