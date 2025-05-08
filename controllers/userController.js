
const { getContract } = require('../utils/contractHelper');


exports.createUser = async (req, res) => {
    try {
      const user = req.body;
  
      const requiredFields = [
        'userId', 'userType', 'userName', 'userEmail', 'userPhone',
        'userAddress', 'userStatus', 'userCreatedAt', 'userUpdatedAt',
        'userDeletedAt', 'userCreatedBy', 'userUpdatedBy', 'userDeletedBy'
      ];
  
      for (const field of requiredFields) {
        if (!user[field]) {
          return res.status(400).json({ error: `Missing field: ${field}` });
        }
      }
  
      const { gateway, contract } = await getContract();
      const result = await contract.submitTransaction('CreateUser', JSON.stringify(user));
      await gateway.disconnect();
  
      res.status(200).json({ message: 'User created successfully', result: result.toString() });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  
  


  exports.viewUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      const { gateway, contract } = await getContract();
      const result = await contract.evaluateTransaction('ViewUser', id);
      await gateway.disconnect();
  
      res.status(200).json(JSON.parse(result.toString()));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  

  exports.updateUser = async (req, res) => {
    try {
      const { gateway, contract } = await getContract();
  
      const user = {
        userId: req.params.id,
        userType: req.body.userType,
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userPhone: req.body.userPhone,
        userAddress: req.body.userAddress,
        userStatus: req.body.userStatus,
        userCreatedAt: req.body.userCreatedAt,
        userUpdatedAt: req.body.userUpdatedAt,
        userDeletedAt: req.body.userDeletedAt,
        userCreatedBy: req.body.userCreatedBy,
        userUpdatedBy: req.body.userUpdatedBy,
        userDeletedBy: req.body.userDeletedBy
      };
  
      await contract.submitTransaction("UpdateUser", JSON.stringify(user));
      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Update failed:", error);
      res.status(500).json({ error: error.message });
    }
  };
  

  exports.viewAllUser = async (req, res) => {
    try {
      const { gateway, contract } = await getContract();
  
      const result = await contract.evaluateTransaction('GetAllUsers');
      const users = JSON.parse(result.toString());
  
      await gateway.disconnect();
  
      // Filter out users with missing or blank userId
      const validUsers = users.filter(
        user => user && user.userId && user.userId.trim() !== ''
      );
  
      // Get page and limit from query params, with default values
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
  
      const paginatedUsers = validUsers.slice(startIndex, endIndex);
  
      res.status(200).json({
        page,
        limit,
        totalUsers: validUsers.length,
        totalPages: Math.ceil(validUsers.length / limit),
        data: paginatedUsers,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  