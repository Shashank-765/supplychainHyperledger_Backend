const { getContract } = require('../utils/contractHelper');

exports.createBatch = async (req, res) => {
  try {
    const batch = req.body;

    const requiredFields = [
      'batchId', 'farmerRegNo', 'farmerName', 'farmerAddress',
      'farmInspectionName', 'harvesterName', 'processorName',
      'exporterName', 'importerName', 'coffeeType', 'qrCode',
      'farmInspectionId', 'harvesterId', 'processorId',
      'exporterId', 'importerId'
    ];

    for (const field of requiredFields) {
      if (!batch[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    const { gateway, contract } = await getContract();
    const result = await contract.submitTransaction('CreateBatch', JSON.stringify(batch));
    await gateway.disconnect();

    res.json({ message: 'Batch created successfully', result: result.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.viewBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { gateway, contract } = await getContract();

    const result = await contract.evaluateTransaction('ViewBatch', id);
    let batch = JSON.parse(result.toString());

    let farmInspector = {};
    let harvester = {};
    let processor = {};
    let exporter = {};
    let importer = {};
  
    try {
      const raw = await contract.evaluateTransaction("ViewFarmInspector", batch.batchId + '_' + batch.farmInspectionId);
      farmInspector = JSON.parse(raw.toString());
    } catch (err) {
      farmInspector = {id: batch.batchId + '_' +batch.farmInspectionId,message:err.message};
      console.warn(`FarmInspector not found for ID ${batch.farmInspectionId}:`, err.message);
    }
  
    try {
      const raw = await contract.evaluateTransaction("ViewHarvester", batch.batchId + '_' + batch.harvesterId);
      harvester = JSON.parse(raw.toString());
    } catch (err) {
      harvester = {id: batch.batchId + '_' +batch.harvesterId ,  message:err.message};
      console.warn(`Harvester not found for ID ${batch.harvesterId}:`, err.message);
    }
  
    try {
      const raw = await contract.evaluateTransaction("ViewProcessor", batch.batchId + '_' + batch.processorId);
      processor = JSON.parse(raw.toString());
    } catch (err) {
      processor = {id: batch.batchId + '_' +batch.processorId , message:err.message};
      console.warn(`Processor not found for ID ${batch.processorId}:`, err.message);
    }
  
    try {
      const raw = await contract.evaluateTransaction("ViewExporter", batch.batchId + '_' + batch.exporterId);
      exporter = JSON.parse(raw.toString());
    } catch (err) {
      exporter = {id: batch.batchId + '_' +batch.exporterId, message:err.message};
      console.warn(`Exporter not found for ID ${batch.exporterId}:`, err.message);
    }
  
    try {
      const raw = await contract.evaluateTransaction("ViewImporter", batch.batchId + '_' + batch.importerId);
      importer = JSON.parse(raw.toString());
    } catch (err) {
      importer = {id: batch.batchId + '_' +batch.importerId , message:err.message};
      console.warn(`Importer not found for ID ${batch.importerId}:`, err.message);
    }
  
    batch.farmInspectionName = farmInspector.processorName || "Farm Inspector";
    batch.harvesterName = harvester.harvesterName || "Harvester";
    batch.processorName = processor.processorName || "Processor";
    batch.exporterName = exporter.exporterName || "Exporter";
    batch.importerName = importer.importerName || "Importer";
  // console.log('farmInspector', farmInspector)
    batch.farmInspectionId = farmInspector;
    batch.harvesterId = harvester;
    batch.processorId = processor;
    batch.exporterId = exporter;
    batch.importerId = importer;
    
    await gateway.disconnect();
    // console.log('batch', batch);
    res.status(200).json(batch);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = req.body;




   

    const { gateway, contract } = await getContract();
    const result = await contract.submitTransaction('UpdateBatch', id, JSON.stringify(batch));



    
    await gateway.disconnect();

    res.status(200).json({ message: 'Batch updated successfully', result: result.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};





exports.viewAllBatch = async (req, res) => {
    try {
      const { gateway, contract } = await getContract();
  
      const result = await contract.evaluateTransaction('GetAllBatches');
      const batches = JSON.parse(result.toString());
  
      await gateway.disconnect();
  
      // Filter out batches with missing or blank BatchID
      const validBatches = batches.filter(
        batch => batch && batch.batchId && batch.batchId.trim() !== '' && batch.farmerRegNo != ""
      );
  
      // Get page and limit from query params, with default values
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
  
      const paginatedBatches = validBatches.slice(startIndex, endIndex);
  
      res.status(200).json({
        page,
        limit,
        totalBatches: validBatches.length,
        totalPages: Math.ceil(validBatches.length / limit),
        data: paginatedBatches,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  
  



  exports.filterBatches = async (req, res) => {
    try {
      const { gateway, contract } = await getContract();
  
      const result = await contract.evaluateTransaction('GetAllBatches');
      const batches = JSON.parse(result.toString());
      let newarray = [];
  
      const { harvesterId, farmInspectorId, processorId, exporterId, importerId } = req.query;
      // console.log('req.query', req.query);
  
      let filtered = batches;
  
      if (harvesterId) {
        filtered = batches.filter(batch => batch.harvesterId && batch.harvesterId.includes(harvesterId) && batch.farmerRegNo != "");
      } else if (farmInspectorId) {
        filtered = batches.filter(batch => batch.farmInspectionId && batch.farmInspectionId.includes(farmInspectorId) && batch.farmerRegNo != "");
      } else if (processorId) {
        filtered = batches.filter(batch => batch.processorId && batch.processorId.includes(processorId) && batch.farmerRegNo != "");
      } else if (exporterId) {
        filtered = batches.filter(batch => batch.exporterId && batch.exporterId.includes(exporterId) && batch.farmerRegNo != "");
      } else if (importerId) {
        filtered = batches.filter(batch => batch.importerId && batch.importerId.includes(importerId) && batch.farmerRegNo != "");
      } else {
        filtered = batches.filter(batch => batch.farmerRegNo != "");
      }
  
      for (let i = 0; i < filtered.length; i++) {
        let batch = filtered[i];
      
        let farmInspector = {};
        let harvester = {};
        let processor = {};
        let exporter = {};
        let importer = {};
      
        try {
          const raw = await contract.evaluateTransaction("ViewFarmInspector", batch.batchId + '_' + batch.farmInspectionId);
          farmInspector = JSON.parse(raw.toString());
        } catch (err) {
          farmInspector = {id: batch.batchId + '_' +batch.farmInspectionId,message:err.message};
          // console.warn(`FarmInspector not found for ID ${batch.farmInspectionId}:`, err.message);
        }
      
        try {
          const raw = await contract.evaluateTransaction("ViewHarvester", batch.batchId + '_' + batch.harvesterId);
          harvester = JSON.parse(raw.toString());
        } catch (err) {
          harvester = {id: batch.batchId + '_' +batch.harvesterId ,  message:err.message};
          // console.warn(`Harvester not found for ID ${batch.harvesterId}:`, err.message);
        }
      
        try {
          const raw = await contract.evaluateTransaction("ViewProcessor", batch.batchId + '_' + batch.processorId);
          processor = JSON.parse(raw.toString());
        } catch (err) {
          processor = {id: batch.batchId + '_' +batch.processorId , message:err.message};
          // console.warn(`Processor not found for ID ${batch.processorId}:`, err.message);
        }
      
        try {
          const raw = await contract.evaluateTransaction("ViewExporter", batch.batchId + '_' + batch.exporterId);
          exporter = JSON.parse(raw.toString());
        } catch (err) {
          exporter = {id: batch.batchId + '_' +batch.exporterId, message:err.message};
          // console.warn(`Exporter not found for ID ${batch.exporterId}:`, err.message);
        }
      
        try {
          const raw = await contract.evaluateTransaction("ViewImporter", batch.batchId + '_' + batch.importerId);
          importer = JSON.parse(raw.toString());
        } catch (err) {
          importer = {id: batch.batchId + '_' +batch.importerId , message:err.message};
          // console.warn(`Importer not found for ID ${batch.importerId}:`, err.message);
        }
      
        batch.farmInspectionName = farmInspector.processorName || "Farm Inspector";
        batch.harvesterName = harvester.harvesterName || "Harvester";
        batch.processorName = processor.processorName || "Processor";
        batch.exporterName = exporter.exporterName || "Exporter";
        batch.importerName = importer.importerName || "Importer";
      
        batch.farmInspectionId = farmInspector;
        batch.harvesterId = harvester;
        batch.processorId = processor;
        batch.exporterId = exporter;
        batch.importerId = importer;
      
        newarray.push(batch);
      }
      
      await gateway.disconnect();
  
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
  
      const paginatedBatches = newarray.slice(startIndex, endIndex);
      res.status(200).json({
        page,
        limit,
        totalBatches: newarray.length,
        totalPages: Math.ceil(newarray.length / limit),
        data: paginatedBatches,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  
  
   




