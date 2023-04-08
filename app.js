const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
require('colors')

const ObjectId = require('mongodb').ObjectId;
const errorController = require('./controllers/errors');
const Member = require('./models/Member');

const app = express();
const PORT = process.env.PORT || 3000;
const DBURL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PW}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DB}`;

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
  //if there is a member, find it in the database
    Member.findById("643179f3f7cdc2db16ece441")
      .then((member) => {
        req.member = member;
        next();
      })
      .catch((err) => console.log(err));
})


app.use('/admin', adminData);
app.use(shopRoutes);

//handles errors
app.use(errorController.notFound)

// mongoConnect(() => {
//   app.listen(PORT);
// })

const logMsg = `DATABASE CONNECTION STATUS: `
const status1 = ` CONNECTED `.green.inverse
const status2 = ` FAILED `.red.inverse

mongoose
  .connect(
    //use try and catch
    DBURL,
    { useNewUrlParser: true,
      useUnifiedTopology: true
    },
    //console log if connected
    console.log(logMsg, status1)
  )
  .then(result => {
    const member = new Member({
        name: 'Bally',
        email: 'bally@testy.com',
        cart: {
          items: []
        }
    })
    member.save()
    app.listen(PORT)
  })
  .catch(err => {
    console.log(logMsg, status2)
    console.log(err)
  })