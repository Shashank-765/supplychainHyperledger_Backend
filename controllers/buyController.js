const { getContract } = require('../utils/contractHelper');

// Create Buy and Update User's Buy List
exports.createBuy = async (req, res) => {
  try {
    const buy = req.body;

    const requiredFields = [
      'transactionId', 'buyerId', 'batchId', 'sellerId',
      'quantity', 'price', 'buyStatus', 'buyCreated', 'buyUpdated'
    ];
   
    for (const field of requiredFields) {
      if (!buy[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    const { gateway, contract } = await getContract();

    console.log('buy', buy)
    console.log('buy', JSON.stringify(buy))

    // Create Buy entry
    const buyResult = await contract.submitTransaction('CreateBuy', JSON.stringify(buy));

  

    await gateway.disconnect();

    res.status(200).json({
      message: 'Buy transaction successful and user updated',
      buy: buyResult.toString()
    });

  } catch (err) {
    console.error('Error in createBuy API:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.viewBuysByBatchId = async (req, res) => {
    try {
      const { batchId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      if (!batchId) {
        return res.status(400).json({ error: 'batchId is required' });
      }
  
      const { gateway, contract } = await getContract();
      const result = await contract.evaluateTransaction('GetBuyTransactionsByBatchId', batchId);
      await gateway.disconnect();
  
      let buys = [];
  
      if (result && result.toString() !== "") {
        buys = JSON.parse(result.toString());
      }
  
      const total = buys.length;
      const totalPages = Math.ceil(total / limit);
      const offset = (page - 1) * limit;
  
      const paginatedBuys = buys.slice(offset, offset + limit);
  
      res.status(200).json({
        message: `Buy transactions for batchId: ${batchId}`,
        currentPage: page,
        totalPages,
        totalRecords: total,
        data: paginatedBuys
      });
  
    } catch (err) {
      console.error('Error fetching buy transactions by batchId:', err);
      res.status(500).json({ error: err.message });
    }
  };
  
  