const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
require('colors')

const errorController = require('./controllers/errors');
const mongoConnect = require('./helper/db').mongoConnect;

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "views");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

  console.log(
    `Server is listening to PORT: ${PORT}...`.blue.inverse
  );

app.use((req, res, next) => {
    // Member.findByPk(1)
    //   .then(member => {
    //     req.member = member;
    //     next();
    //   })
    //   .catch(err => console.log(err))
    next()
})


app.use('/admin', adminData);
app.use(shopRoutes);

//handles errors
app.use(errorController.notFound)

mongoConnect(() => {
  app.listen(PORT);
})

