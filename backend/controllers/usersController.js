const userModel = require('../models/userModel');

// GET /api/users
exports.listUsers = async (req, res) => {
  try {
    const users = await userModel.getUsers({ page: 1, limit: 1000 }); // return all users
    res.json({ users }); // frontend expects res.data.users
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// PUT /api/users/:uuid
exports.updateUser = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { name, email, city } = req.body;
    await userModel.updateUser(uuid, { name, email, city });
    const user = await userModel.findUserByUuid(uuid);
    res.json({ message: 'updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
};

// POST /api/users/fetch
exports.fetchAndInsert = async (req, res) => {
  res.json({ message: 'Fetch disabled for now.' });
};
