const express = require('express');
const router= express.Router();
//const cryptr = new Cryptr('myTotalySecretKey');
const expenseController=require('../controllers/expenseController')








router.post('/create',expenseController.create)
router.post('/delete',expenseController.deleteExpense)


router.get('/:id',expenseController.getExpense)










module.exports = router;