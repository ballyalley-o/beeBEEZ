const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const {
  DATABASE,
  logMsg,
  status1,
  status2,
  serverLog,
} = require("./helper/logger");
require('dotenv').config();
require('colors')
const DBURL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PW}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DB}`;
const store = new MongoDBStore({
  uri: DBURL,
  collection: 'Sessions'
})



const ObjectId = require('mongodb').ObjectId;
const errorController = require('./controllers/errors');
const Member = require('./models/Member');

const app = express();
const PORT = process.env.PORT || 3000;


app.set("view engine", "ejs");
app.set("views", "views");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
                  secret: 'secret',
                  resave: false,
                  saveUninitialized: false,
                  store: store
                }))

app.use((req, res, next) => {
  if (!req.session.member) {
    return next();
  }
  Member.findById(req.session.member._id)
    .then((member) => {
      req.member = member;
      next();
    })
    .catch((err) => console.log(err));
});

  console.log(serverLog);

app.use((req, res, next) => {
  //if there is a member, find it in the database
    Member.findById("643227a193e6d7e18ded12a9")
      .then((member) => {
        req.session.member = member;
        next();
      })
      .catch((err) => console.log(err));
})


app.use('/admin', adminData);
app.use(shopRoutes);
app.use(authRoutes);

//handles errors
app.use(errorController.notFound)



mongoose
  .connect(
    //use try and catch
    DBURL,
    { useNewUrlParser: true,
      useUnifiedTopology: true
    },
    //console log if connected
    console.log("DATABASE: ", DATABASE.bgMagenta),
    console.log(logMsg, status1)
  )
  .then(result => {
    Member.findOne().then(member => {
      if (!member) {
        const member = new Member({
          name: "Bally",
          email: "bally@testy.com",
          cart: {
            items: [],
          },
        });
         member.save();
      }
    })
    app.listen(PORT)
  })
  .catch(err => {
    console.log(logMsg, status2)
    console.log(err)
  })