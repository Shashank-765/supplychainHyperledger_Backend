const { getContract } = require('../utils/contractHelper');

exports.createHarvester = async (req, res) => {
  try {
    const harvester = req.body;

    const requiredFields = [
      'harvestId', 'harvesterName', 'cropSampling', 'temperatureLevel',
      'humidityLevel', 'harvestStatus', 'harvestCreatedAt', 'harvestUpdatedAt',
      'harvestDeletedAt', 'batchId'
    ];

    for (const field of requiredFields) {
      if (!harvester[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    const { gateway, contract } = await getContract();
    const result = await contract.submitTransaction('CreateHarvester', JSON.stringify(harvester));
    await gateway.disconnect();

    res.status(200).json({ message: 'Harvester created successfully', result: result.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.viewHarvester = async (req, res) => {
  try {
    const { id } = req.params;

    const { gateway, contract } = await getContract();
    const result = await contract.evaluateTransaction('ViewHarvester', id);
    await gateway.disconnect();

    res.status(200).json(JSON.parse(result.toString()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateHarvester = async (req, res) => {
  try {
    const { gateway, contract } = await getContract();

    const harvester = {
      harvestId: req.params.id,
      harvesterName: req.body.harvesterName,
      cropSampling: req.body.cropSampling,
      temperatureLevel: req.body.temperatureLevel,
      humidityLevel: req.body.humidityLevel,
      harvestStatus: req.body.harvestStatus,
      harvestCreatedAt: req.body.harvestCreatedAt,
      harvestUpdatedAt: req.body.harvestUpdatedAt,
      harvestDeletedAt: req.body.harvestDeletedAt,
      batchId: req.body.batchId
    };

    await contract.submitTransaction("UpdateHarvester", JSON.stringify(harvester));
    res.status(200).json({ message: "Harvester updated successfully" });
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ error: error.message });
  }
};
