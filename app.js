const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

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
const csrfProtect = csrf()


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

app.use(csrfProtect)
app.use(flash())
app.use((req, res, next) => {
  if (!req.session.member) {
    return next();
  }
  Member.findById(req.session.member._id)
    .then((member) => {
      if (!member) {
        next();
      }
      req.member = member;
      next();
    })
    .catch((err) => {
      next(new Error(err))
    });
});

//middleware to pass to all routes, protect to csrf attacks, for authentification
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

  console.log(serverLog);

app.use('/admin', adminData);
app.use(shopRoutes);
app.use(authRoutes);

//handles errors

app.get('/500', errorController.get500)
app.use(errorController.notFound);

app.use ((error, req, res, next) => {
  // res.redirect('/500')
  res.status(500).render('500', {
    pageTitle: 'Error',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  })
})

mongoose
  .connect(
    DBURL,
    { useNewUrlParser: true,
      useUnifiedTopology: true
    },
    console.log("DATABASE: ", DATABASE.bgMagenta),
    console.log(logMsg, status1)
  )
  .then(result => {
    app.listen(PORT)
  })
  .catch(err => {
    console.log(logMsg, status2)
    console.log(err)
  })