const express = require('express');
const router = express.Router();
const batchController = require('../controllers/processorController');

router.post('/addProcessor', batchController.createProcessor);
router.get('/processor/:id', batchController.viewProcessor);
router.put('/updateProcessor/:id', batchController.updateProcessor);


module.exports = router;
