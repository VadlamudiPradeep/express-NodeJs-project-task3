const Sequelize = require('sequelize');

const sequelize = new Sequelize('expenses', 'root', '1qaz2wsx3edc', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;