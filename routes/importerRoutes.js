const express = require('express');
const router = express.Router();
const batchController = require('../controllers/importerController');

router.post('/addImporter', batchController.createImporter);
router.get('/importer/:id', batchController.viewImporter);
router.put('/updateImporter/:id', batchController.updateImporter);


module.exports = router;
