const express = require('express');
const router = express.Router();
const batchController = require('../controllers/harvesterController');

router.post('/addHarvester', batchController.createHarvester);
router.get('/harvester/:id', batchController.viewHarvester);
router.put('/updateHarvester/:id', batchController.updateHarvester);


module.exports = router;
