const express = require('express');
const router = express.Router();
const batchController = require('../controllers/exporterController');

router.post('/addExporter', batchController.createExporter);
router.get('/exporter/:id', batchController.viewExporter);
router.put('/updateExporter/:id', batchController.updateExporter);


module.exports = router;
