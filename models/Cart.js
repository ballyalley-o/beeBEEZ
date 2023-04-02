const Sequelize = require('sequelize');
const sequelize = require('../helper/db-sql.js_bu')

const Cart = sequelize.define('cart', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Cart;
