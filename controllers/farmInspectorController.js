const { getContract } = require('../utils/contractHelper');

exports.createFarmInspector = async (req, res) => {
  try {
    const inspector = req.body;

    const requiredFields = [
      'farmInspectionId', 'farmInspectionName', 'certificateNo', 
      'certificateFrom', 'productName', 'typeOfFertilizer', 
      'fertilizerUsed', 'batchId', 'farmInspectionStatus'
    ];

    for (const field of requiredFields) {
      if (!inspector[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    if (!Array.isArray(inspector.image)) {
      inspector.image = ['nil']; // default to empty array if not provided
    }
    console.log('inspector', inspector);
    const { gateway, contract } = await getContract();
    const result = await contract.submitTransaction('CreateFarmInspector', JSON.stringify(inspector));
    await gateway.disconnect();

    res.status(200).json({ message: 'Farm Inspector created successfully', result: result.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.viewFarmInspector = async (req, res) => {
  try {
    const { id } = req.params;

    const { gateway, contract } = await getContract();
    console.log('id', id)
    const result = await contract.evaluateTransaction('ViewFarmInspector', id);
    console.log('result', result)
    await gateway.disconnect();

    res.status(200).json(JSON.parse(result.toString()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.updateFarmInspector = async (req, res) => {
  try {
    const { gateway, contract } = await getContract();

    const farmInspector = {
      farmInspectionId: req.params.id,
      farmInspectionName: req.body.farmInspectionName,
      certificateNo: req.body.certificateNo,
      certificateFrom: req.body.certificateFrom,
      productName: req.body.productName,
      typeOfFertilizer: req.body.typeOfFertilizer,
      fertilizerUsed: req.body.fertilizerUsed,
      farmInspectionStatus: req.body.farmInspectionStatus,
      farmInspectionCreatedAt: req.body.farmInspectionCreatedAt,
      farmInspectionUpdatedAt: req.body.farmInspectionUpdatedAt,
      farmInspectionDeletedAt: req.body.farmInspectionDeletedAt,
      image: req.body.image || ['nil'],
      batchId: req.body.batchId
    };

    await contract.submitTransaction("UpdateFarmInspector", JSON.stringify(farmInspector));

    res.status(200).json({ message: "Farm inspector updated successfully" });
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ error: error.message });
  }
};
