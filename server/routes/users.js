var express = require('express');
const { login, register } = require('../controllers/userController');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.route("/login").post(login)
router.route("/register").post(register)

module.exports = router;
