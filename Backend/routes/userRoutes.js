const express = require('express');
const router = express.Router();
const {registerFun,authuserFun,allusersFun,googleLogin,googleRegister} = require('../controller/userController');
const protect = require('../middleware/authMiddleware');

// router.route('/login').get(loginFun);
router.post('/', registerFun)
router.get('/', protect,allusersFun);
router.post('/login', authuserFun);
router.post('/google-login',googleLogin);
router.post('/google-register',googleRegister);
// both of these functions are in the userController.js file

module.exports = router;
 