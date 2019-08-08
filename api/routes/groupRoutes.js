const express = require('express');

const router= express.Router();

const groupController=require('../controllers/groupController')

router.post('/create',groupController.create)
router.post('/checkuser',groupController.checkUser)
router.post('/delete',groupController.deleteGroup)
router.post('/edit',groupController.editGroup)


router.get('/groupexpense/:id',groupController.getGroupExpences)
router.get('/:id',groupController.getGroup)




module.exports = router;