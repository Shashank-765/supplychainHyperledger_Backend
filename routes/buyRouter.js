const express = require('express');
const router = express.Router();
const buyRoutes = require('../controllers/buyController');

router.post('/buy', buyRoutes.createBuy);
router.get('/viewbuy/:batchId',buyRoutes.viewBuysByBatchId)


module.exports = router;



