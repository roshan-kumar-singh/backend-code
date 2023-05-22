const Message = require("../model/Message");
class messageController {
  
  addNewMessages = async (req, res) => {
    const newMessage = new Message(req.body);

    try {
      const savedMessage = await newMessage.save();
      // Emit an event to the receiver user using socket.io
      const receiverUser = getUser(req.body.receiverId);
      if (receiverUser) {
        io.to(receiverUser.socketId).emit("newMessage", savedMessage);
      }
      res.status(200).json(savedMessage);
    } catch (err) {
      res.status(500).json(err);
    }
  }
      
      getMessages = async (req, res) => {
        try {
          const messages = await Message.find({
            conversationId: req.params.conversationId,
          });
          res.status(200).json(messages);
        } catch (err) {
          res.status(500).json(err);
        }
      }
}
module.exports = new messageController();