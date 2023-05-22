const router = require('express').Router();
const conversationController = require('../controller/conversation.controller');


//new conversation

router.post("/",conversationController.newConversation );
  
//get conversation of a users
router.get("/:userId", conversationController.getConversationUsers);
  
// get conversation includes two userId
  router.get("/find/:firstUserId/:secondUserId", conversationController.getConversationIncludesTwoUserId );
  
  module.exports = router;