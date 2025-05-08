const { getContract } = require('../utils/contractHelper');

exports.createProcessor = async (req, res) => {
  try {
    const processor = req.body;
console.log('req.body', req.body)
    const requiredFields = [
      'processorId','processorName', 'price', 'quantity', 'processingMethod', 'packaging',
      'packagedDate', 'warehouse', 'warehouseLocation', 'destination',
      'processorStatus', 'processorCreated', 'processorUpdated',
      'processorDeleted', 'batchId'
    ];

    for (const field of requiredFields) {
      if (!processor[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    if (!Array.isArray(processor.image)) {
      processor.image = ['nil']; // default to empty array if not provided
    }

    const { gateway, contract } = await getContract();
    const result = await contract.submitTransaction('CreateProcessor', JSON.stringify(processor));
    await gateway.disconnect();

    res.status(200).json({ message: 'Processor created successfully', result: result.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.viewProcessor = async (req, res) => {
  try {
    const { id } = req.params;

    const { gateway, contract } = await getContract();
    const result = await contract.evaluateTransaction('ViewProcessor', id);
    await gateway.disconnect();
// console.log('result', result)
    res.status(200).json(JSON.parse(result.toString()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateProcessor = async (req, res) => {
  try {
    const { gateway, contract } = await getContract();

    const processor = {
      processorId: req.params.id,
      processorName: req.body.processorName,
      price: req.body.price,
      quantity: req.body.quantity,
      processingMethod: req.body.processingMethod,
      packaging: req.body.packaging,
      packagedDate: req.body.packagedDate,
      warehouse: req.body.warehouse,
      warehouseLocation: req.body.warehouseLocation,
      destination: req.body.destination,
      processorStatus: req.body.processorStatus,
      processorCreated: req.body.processorCreated,
      processorUpdated: req.body.processorUpdated,
      processorDeleted: req.body.processorDeleted,
      image: req.body.image || ['nil'],
      batchId: req.body.batchId
    };

    await contract.submitTransaction("UpdateProcessor", JSON.stringify(processor));
    res.status(200).json({ message: "Processor updated successfully" });
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ error: error.message });
  }
};

