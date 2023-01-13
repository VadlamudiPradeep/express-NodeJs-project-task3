const Sequelize = require('sequelize');
const sequelize = require('../util/database');

// create user table - expense
const User = sequelize.define('expense', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    
    expenseamount: Sequelize.INTEGER,
    category: Sequelize.STRING,
<<<<<<< HEAD
    description: Sequelize.TEXT,
=======
    description: Sequelize.STRING,
    
>>>>>>> ceaee63 (Authorization_To_Backend_To_Database)
})

module.exports = User;