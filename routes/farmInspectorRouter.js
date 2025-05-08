const express = require('express');
const router = express.Router();
const userController = require('../controllers/farmInspectorController');

router.post('/addInspector', userController.createFarmInspector);
router.get('/farmInspector/:id', userController.viewFarmInspector);
router.put('/updateInspector/:id', userController.updateFarmInspector);

module.exports = router;
