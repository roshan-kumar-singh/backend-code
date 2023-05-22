const router = require('express').Router();
const ChatSettingController = require('../controller/chat_setting.controller');


//Request List
router.get('/requests', ChatSettingController.requestList);

//accept message request
router.post('/requests/:requestId/accept', ChatSettingController.acceptMessageRequest );

// Block user
router.post('/block/:userId', ChatSettingController.blockUser);

// Unblock user
router.delete('/blocks/:userId',ChatSettingController.unblockUser );
  
// Get blocked user list
  router.get('/blocks', ChatSettingController.getBlockedUserList);
  
//Accept message request
  router.get('/:userId', ChatSettingController.acceptMessageRequest);
  
  module.exports = router;