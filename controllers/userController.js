
const { getContract } = require('../utils/contractHelper');


exports.createUser = async (req, res) => {
    try {
      const user = req.body;
      // Check if all required fields are present
      const requiredFields = [
        'userId', 'userType','userRole', 'userName', 'userEmail', 'userPhone',
        'userAddress','userPassword' , 'userStatus', 'userCreatedAt', 'userUpdatedAt',
        'userDeletedAt', 'userCreatedBy', 'userUpdatedBy', 'userDeletedBy' ,
        'userWalletAddress','userBuyProducts', 'userIsDeleted'
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
        userRole: req.body.userRole,
        userEmail: req.body.userEmail,
        userPhone: req.body.userPhone,
        userAddress: req.body.userAddress,
        userPassword: req.body.userPassword,
        userWalletAddress: req.body.userWalletAddress,
        userBuyProducts: req.body.userBuyProducts,
        userIsDeleted: req.body.userIsDeleted,
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
  

  exports.viewSpecificRoleUsers = async (req, res) => {
    try {
      const { gateway, contract } = await getContract();
  
      const result = await contract.evaluateTransaction('GetAllUsers');
      const users = JSON.parse(result.toString());
  
      await gateway.disconnect();
  
      const validUsers = users.filter(
        user => user && user.userId && user.userId.trim() !== ''
      );
  
      const includedRoles = [
        "Farm Inspection",
        "Harvester",
        "Importer",
        "Exporter",
        "Processor"
      ];
  
      let filteredUsers = validUsers.filter(user =>
        includedRoles.includes(user.userRole)
      );
  
      // 🔍 Unified regex search across multiple fields
      const { search } = req.query;
  
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filteredUsers = filteredUsers.filter(user =>
          searchRegex.test(user.userName) ||
          searchRegex.test(user.userRole) ||
          searchRegex.test(user.userEmail) ||
          searchRegex.test(user.userPhone)
        );
      }
  
      // 👉 Count number of users for each included role (after filtering)
      const roleCounts = includedRoles.reduce((acc, role) => {
        acc[role] = filteredUsers.filter(user => user.userRole === role).length;
        return acc;
      }, {});
  
      // 📄 Pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
  
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
      res.status(200).json({
        page,
        limit,
        totalUsers: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit),
        roleCounts,
        data: paginatedUsers,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  
  
  exports.viewOtherUsers = async (req, res) => {
    try {
      const { gateway, contract } = await getContract();
  
      const result = await contract.evaluateTransaction('GetAllUsers');
      const users = JSON.parse(result.toString());
  
      await gateway.disconnect();
  
      const validUsers = users.filter(
        user => user && user.userId && user.userId.trim() !== ''
      );
  
      const excludedRoles = [
        "Farm Inspection",
        "Harvester",
        "Importer",
        "Exporter",
        "Processor",
        "admin",
        "Admin"
      ];
  
      // Filter out excluded roles
      let filteredUsers = validUsers.filter(user => !excludedRoles.includes(user.userRole));
  
      // 🔍 Unified regex search across multiple fields
      const { search } = req.query;
  
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filteredUsers = filteredUsers.filter(user =>
          searchRegex.test(user.userName) ||
          searchRegex.test(user.userRole) ||
          searchRegex.test(user.userEmail) ||
          searchRegex.test(user.userPhone)
        );
      }
  
      // 📄 Pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
  
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
      res.status(200).json({
        page,
        limit,
        totalUsers: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit),
        data: paginatedUsers,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  
    
  