const express = require('express');
const app = express();

// It allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources.
var cors = require("cors");

app.use(cors());

// It provides four express middleware for parsing JSON, Text, URL-encoded, and raw data sets over an HTTP request body.
const bodyParser = require('body-parser');
// The "extended" syntax allows for rich objects and arrays to be encoded into the URL-encoded format, allowing for a JSON-like experience with URL-encoded.
// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Import
const userRoutes = require('./routes/userRoutes');
// use routes '/user' automatically add 'user' before link.
app.use('/user', userRoutes);



// if database sync then start the server.
const sequelize = require('./util/database');
sequelize
// force: true -> the database gets dropped and recreated, so of course it matches the latest schema, but you lose all data.  
// .sync({ force: true })
  .sync()
  // sync() is used to synchronize your Sequelize model with your database tables.
  .then(() => {
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });