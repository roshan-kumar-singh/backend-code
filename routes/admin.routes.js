const router = require('express').Router();
const adminController = require('../controller/admin.controller');


//Admin Register
router.post("/admin-register",adminController.adminRegister );

 //get all admin data
 router.get('/admin-details',adminController.adminDetails)

 //Admin login 
 router.post('/admin-login', adminController.adminSignIn);
 
//get all user data in admin panel
router.get('/user-details', adminController.userDetailsInAdmin);

//admin can see users followers, following , hirable, rating
router.get('/admin-personal-user-view/:userId', adminController.adminUserPersonalAccountView);

//admin can see bussiness user 
router.get('/admin-bussiness-user-view/:userId', adminController.adminUserBussinessAccountView);

//admin can see users likes, comments adminViewPost
router.get('/story/:userId', adminController.adminViewStory);

//admin can see users
router.get('/admin-post-view', adminController.adminViewPost);

//admin can see intrest adminViewIntrest
router.get('/admin-intrest-view/:userId', adminController.adminViewIntrest);

//adminViewchat admin can see chat
router.get('/admin-chat-view/:userId', adminController.adminViewchat);

//admin explore can see
router.get('/admin-chat-view/:userId', adminController.adminViewchat);


module.exports = router