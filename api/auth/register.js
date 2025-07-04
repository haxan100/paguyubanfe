const AuthController = require('../../controllers/AuthController');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    await AuthController.register(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};