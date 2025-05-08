const { getContract } = require('../utils/contractHelper');

exports.createImporter = async (req, res) => {
  try {
    const importer = req.body;

    const requiredFields = [
      'importerId', 'importerName' ,'quantity', 'shipStorage', 'arrivalDate',
      'warehouseLocation', 'warehouseArrivalDate', 'importerAddress',
      'importerStatus', 'importerCreated', 'importerUpdated',
      'importerDeleted', 'batchId'
    ];

    for (const field of requiredFields) {
      if (!importer[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    const { gateway, contract } = await getContract();
    const result = await contract.submitTransaction('CreateImporter', JSON.stringify(importer));
    await gateway.disconnect();

    res.status(200).json({ message: 'Importer created successfully', result: result.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



exports.viewImporter = async (req, res) => {
  try {
    const { id } = req.params;

    const { gateway, contract } = await getContract();
    const result = await contract.evaluateTransaction('ViewImporter', id);
    await gateway.disconnect();

    res.status(200).json(JSON.parse(result.toString()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateImporter = async (req, res) => {
  try {
    const { gateway, contract } = await getContract();

    const importer = {
      importerId: req.params.id,
      importerName: req.body.importerName,
      quantity: req.body.quantity,
      shipStorage: req.body.shipStorage,
      arrivalDate: req.body.arrivalDate,
      warehouseLocation: req.body.warehouseLocation,
      warehouseArrivalDate: req.body.warehouseArrivalDate,
      importerAddress: req.body.importerAddress,
      importerStatus: req.body.importerStatus,
      importerCreated: req.body.importerCreated,
      importerUpdated: req.body.importerUpdated,
      importerDeleted: req.body.importerDeleted,
      batchId: req.body.batchId
    };

    await contract.submitTransaction("UpdateImporter", JSON.stringify(importer));
    res.status(200).json({ message: "Importer updated successfully" });
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ error: error.message });
  }
};


