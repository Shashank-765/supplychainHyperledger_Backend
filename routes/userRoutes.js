const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/addUser', userController.createUser);
router.get('/user/:id', userController.viewUser);
router.put('/updateUser/:id', userController.updateUser);
router.get('/users', userController.viewAllUser);


module.exports = router;
