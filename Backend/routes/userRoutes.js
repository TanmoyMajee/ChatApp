const express = require('express');
const router = express.Router();
const {registerFun,authuserFun,allusersFun} = require('../controller/userController');
const protect = require('../middleware/authMiddleware');

// router.route('/login').get(loginFun);
router.post('/', registerFun)
router.get('/', protect,allusersFun);
router.post('/login', authuserFun);
// both of these functions are in the userController.js file

module.exports = router;
 