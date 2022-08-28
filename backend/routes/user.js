const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const limiter = require('../middleware/limiter');
const password = require('../middleware/password');


router.post('/signup', password, userCtrl.signup);
router.post('/login', limiter, userCtrl.login);


module.exports = router;