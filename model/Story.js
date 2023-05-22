const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
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
        Comments: [{
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            
          },
          text: {
            type: String,
            required: true
          },
          reactions: [
            {
              type: String,
              enum: ['love', 'smiley', 'like'], 
            },
          ],
        }],
        shares: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }]
      },
{ timestamps: true });

module.exports = mongoose.model("story", storySchema);