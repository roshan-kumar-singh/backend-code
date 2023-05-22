require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').createServer(app); // Create an HTTP server instance
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const io = require('socket.io')(http); // Pass the HTTP server to socket.io
const { addUser, removeUser, getUser } = require('./socket'); // Import socket.io functions

const authRouter = require('./routes/auth.routes');
const postRouter = require('./routes/post.routes');
const conversationRoute = require('./routes/conversation.routes');
const messageRoute = require('./routes/messages.routes');
const chat_settingRoute = require('./routes/chat_setting.routes');
const storyRoute = require('./routes/story.rotues');
const adminRoute = require('./routes/admin.routes');

mongoose.connect(process.env.MONGO_URI).then(
  () => console.log('db is connected..')
).catch(err => console.log(err));

// middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/chat_setting", chat_settingRoute);
app.use("/api/story", storyRoute);
app.use("/api/admin", adminRoute);

// Socket.io connection
io.on("connection", (socket) => {
  // When connect
  console.log("A user connected.");

  // Take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // Send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  // When disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

// Start the server
const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
