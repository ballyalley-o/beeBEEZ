const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/errors')

const app = express();

const PORT = 3001;

app.set("view engine", "ejs");
app.set("views", "views");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

  console.log(`Server is listening to PORT: ${PORT}...`)

app.use('/admin', adminData);
app.use(shopRoutes);

//handles errors
app.use(errorController.notFound)


app.listen(PORT)