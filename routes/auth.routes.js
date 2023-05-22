const router = require('express').Router();
const authController = require('../controller/auth.controller');

//Register
router.post("/register",authController.register )

//get all data
router.get('/userdetails',authController.userDetails)

//signin
router.post('/login', authController.signIn);
 
//change Password
router.post('/changepassword', authController.changePassword);


//user profile setup (personal or professional)
router.put('/profile/:_id', authController.profile);

//personal account setup
router.post('/setup-personal-account', authController.setupPersonalAccount);

//professional account setup
router.post('/setup-professional-account', authController.setupProfessionaAccount);


//intrest list
router.get('/interests', authController.intrest);

//choose intrest
router.post('/addInterest/:_id',authController.chooseIntrest);

//email send
//router.post('/email-send',authController.emailSend);

//change password
router.post('/change-password',authController.changePassword);


module.exports = router

