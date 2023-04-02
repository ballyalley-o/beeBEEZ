const Sequelize = require('sequelize');
const sequelize = require('../helper/db')

const Member = sequelize.define('member', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING
})


module.exports = Member;

