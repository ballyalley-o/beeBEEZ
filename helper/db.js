const Sequelize = require('sequelize');

const sequelize = new Sequelize(
                            'beeBEEZ'
                            , 'root'
                            , 'password'
                            ,
                            {
                              dialect: 'mysql'
                            , host: 'localhost'
                            }
                                )

module.exports = sequelize;