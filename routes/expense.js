const express = require('express');

const expenseController = require('../controllers/expense')
const userauthentication = require('../middleware/auth')

const router = express.Router();

router.post('/addExpense', userauthentication.authenticate,  expenseController.addExpense )

router.get('/getExpense', userauthentication.authenticate ,  expenseController.getExpense)

router.delete('/deleteExpense/:expenseid', userauthentication.authenticate ,   expenseController.deleteExpense)

router.get('/download' , userauthentication.authenticate , expenseController.downloadExpenses)


module.exports = router;