const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');

router.post('/addBatch', batchController.createBatch);
router.get('/batch/:id', batchController.viewBatch);
router.put('/updatebatch/:id', batchController.updateBatch);
router.get('/batchs', batchController.viewAllBatch);
router.get('/batches/filter', batchController.filterBatches);

module.exports = router;
