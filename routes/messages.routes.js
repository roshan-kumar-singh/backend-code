const router = require("express").Router();
const messageController = require('../controller/message.controller');

//add new messages
router.post("/",messageController.addNewMessages);

//get messages
router.get("/:conversationId", messageController.getMessages);

module.exports = router;