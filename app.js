const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./helper/db')
const logger = require('./helper/logger');
require('colors')
//models
const Product = require('./models/Product')
const Cart = require('./models/Cart')
const CartItem = require('./models/Cart-item')
const Member = require('./models/Member')
const Order = require('./models/Order')
const OrderItem = require('./models/Order-item')

const errorController = require('./controllers/errors')

const app = express();
const PORT = 3001;

app.set("view engine", "ejs");
app.set("views", "views");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

  console.log(`Server is listening to PORT: ${PORT}...`.blue.inverse);

app.use((req, res, next) => {
    Member.findByPk(1)
      .then(member => {
        req.member = member;
        next();
      })
      .catch(err => console.log(err))
})


app.use('/admin', adminData);
app.use(shopRoutes);


//handles errors
app.use(errorController.notFound)

Product.belongsTo(Member, {
  constraints: true,
  onDelete: 'CASCADE'
})
Member.hasMany(Product);

Cart.belongsTo(Member);
Member.hasOne(Cart);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
Order.belongsTo(Member);
Member.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});


sequelize
    .sync()
    .then(result => {
      return Member.findByPk(1)

    })
    .then(member => {
      if(!member) {
        return Member.create({name: 'John', email: 'johnny@doe.com'})
      }
      return member
    })
    .then(member => {
      return member.createCart();
    })
    .then(member => {
        app.listen(PORT);
    })
    .catch(err => {
      console.log(err)
    })


