const { getContract } = require('../utils/contractHelper');

exports.createExporter = async (req, res) => {
  try {
    const exporter = req.body;

    const requiredFields = [
      'exporterId','exporterName', 'coordinationAddress', 'shipName', 'shipNo',
      'departureDate', 'estimatedDate', 'exportedTo', 'exporterStatus',
      'exporterCreated', 'exporterUpdated', 'exporterDeleted', 'batchId'
    ];

    for (const field of requiredFields) {
      if (!exporter[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    const { gateway, contract } = await getContract();
    const result = await contract.submitTransaction('CreateExporter', JSON.stringify(exporter));
    await gateway.disconnect();

    res.status(200).json({ message: 'Exporter created successfully', result: result.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.viewExporter = async (req, res) => {
  try {
    const { id } = req.params;

    const { gateway, contract } = await getContract();
    const result = await contract.evaluateTransaction('ViewExporter', id);
    await gateway.disconnect();

    res.status(200).json(JSON.parse(result.toString()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



exports.updateExporter = async (req, res) => {
  try {
    const { gateway, contract } = await getContract();

    const exporter = {
      exporterId: req.params.id,
      exporterName: req.body.exporterName,
      coordinationAddress: req.body.coordinationAddress,
      shipName: req.body.shipName,
      shipNo: req.body.shipNo,
      departureDate: req.body.departureDate,
      estimatedDate: req.body.estimatedDate,
      exportedTo: req.body.exportedTo,
      exporterStatus: req.body.exporterStatus,
      exporterCreated: req.body.exporterCreated,
      exporterUpdated: req.body.exporterUpdated,
      exporterDeleted: req.body.exporterDeleted,
      batchId: req.body.batchId
    };

    await contract.submitTransaction("UpdateExporter", JSON.stringify(exporter));
    res.status(200).json({ message: "Exporter updated successfully" });
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ error: error.message });
  }
};
