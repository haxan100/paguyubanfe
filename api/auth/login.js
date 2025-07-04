const AuthController = require('../../controllers/AuthController');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    await AuthController.login(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};