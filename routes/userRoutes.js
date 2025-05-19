const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/addUser', userController.createUser);
router.get('/user/:id', userController.viewUser);
router.put('/updateUser/:id', userController.updateUser);
router.get('/users/specific-roles', userController.viewSpecificRoleUsers);
router.get('/users/others', userController.viewOtherUsers);

module.exports = router;
