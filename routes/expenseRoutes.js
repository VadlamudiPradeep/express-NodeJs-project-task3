const express = require('express');
const router = express.Router();



const expenseControllers = require('../controllers/expensesControllers')

router.post('/addExpense',expenseControllers.addExpense);

router.get('/getExpense',expenseControllers.getExpense);

// router.get('/pages/:pages', expenseControllers.updatePages)

router.delete('/deleteExpense/:expenseid',  expenseControllers.deleteExpense);


module.exports = router;