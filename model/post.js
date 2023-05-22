
 const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
      userId: {
        type: String,
        ref: 'User',
        required: true
      },
      mediaType: {
        type: String,
        enum: ['image', 'video', 'text'],
        required: true
      },
      mediaUrl: {
        type: String,
        required: true
      },
      Likes: [{
        type: String,
        default: '0'
      }],
      Poll: {
        type: String,
        default: '0'
      },
      Votes: {
        type: String,
        default: '0'
      },
      Comments: [{
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          
        },
        text: {
          type: String,
          required: true,
          default: 'no comments'
        },
      }],
      shares: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }]
    },
{ timestamps: true });

module.exports = mongoose.model("post", PostSchema);