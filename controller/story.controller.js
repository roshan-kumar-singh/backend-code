const story = require("../model/Story");
class storyController{
    addStory = async (req, res) => {
        const { userId, mediaType, mediaUrl } = req.body;
      
        try {
          const newStory = new story({
            userId,
            mediaType,
            mediaUrl
          });
          
          const savedStory = await newStory.save();
          res.status(200).json({ message: 'Story added successfully', story: savedStory });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Server Error' });
        }
      }
//get all story
      getStoryListFollowingUser =  async (req, res) => {
        try {
          const stories = await story.find();
          return res.json(stories);
      
          
        } catch (err) {
          console.error(err);
          res.status(500).send('Server error');
        }
      }
//user can like the story
      likeStory = async (req, res) => {
        try {
          const { _id } = req.params; //story id
          const { userId } = req.body;//user id
      
          const stories = await story.findOne({ _id });
          if (stories.Likes.includes(userId)) {
            return res.status(400).json({ message: 'You have already liked this story' });
          }
          stories.Likes.push(userId);
          await stories.save();
      
          res.json({ message: 'Story liked successfully' });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal server error' });
        }
      } 

      //user can comment on story
      commentStory = async (req, res) => {
        try {
          const { _id } = req.params;
          const { userId, text } = req.body;
          const stories = await story.findOne({_id});
          const newComment = {
            userId,
            text
          };
      
          stories.Comments.push(newComment);
          await stories.save();
      
          res.json({ message: 'Comment added successfully', stories });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        }
      };
// get all comment list

      getCommentList =  async (req, res) => {
          try {
    const { _id } = req.params;
    const stories = await story.findOne({_id}); // Populating the userId field to get the username of the commenter
    if (!stories) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json({ comments: stories.Comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
      }

       //filter comment list
        filterCommentList = async (req, res) => {
          try {
            // Get the filter option from the request query parameters
            const { filter } = req.query;
        
            // Construct the Mongoose aggregation pipeline based on the filter option
            let pipeline = [];
        
            if (filter === 'new_comment') {
              pipeline = [
                { $unwind: '$Comments' },
                { $sort: { 'Comments.createdAt': -1 } },
                {
                  $group: {
                    _id: '$_id',
                    userId: { $first: '$userId' },
                    mediaType: { $first: '$mediaType' },
                    mediaUrl: { $first: '$mediaUrl' },
                    Likes: { $first: '$Likes' },
                    shares: { $first: '$shares' },
                    Comments: { $push: '$Comments' }
                  }
                }
              ];
            } else if (filter === 'old_comment') {
              pipeline = [
                { $unwind: '$Comments' },
                { $sort: { 'Comments.createdAt': 1 } },
                {
                  $group: {
                    _id: '$_id',
                    userId: { $first: '$userId' },
                    mediaType: { $first: '$mediaType' },
                    mediaUrl: { $first: '$mediaUrl' },
                    Likes: { $first: '$Likes' },
                    shares: { $first: '$shares' },
                    Comments: { $push: '$Comments' }
                  }
                }
              ];
            } else {
              // Default case: no filter, retrieve all stories
              pipeline = [
                {
                  $project: {
                    _id: 1,
                    userId: 1,
                    mediaType: 1,
                    mediaUrl: 1,
                    Likes: 1,
                    shares: 1,
                    Comments: 1
                  }
                }
              ];
            }
        
            // Execute the aggregation pipeline
            const stories = await story.aggregate(pipeline);
        
            res.json(stories);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
          }
      }
      addReactComment = async (req, res) => {
        try {
          const { storyId, commentId } = req.params;
          const { reaction } = req.body;
      
          // Find the story by its ID and update the comment's reactions
          const Story = await story.findOneAndUpdate(
            { _id: storyId, 'Comments._id': commentId },
            { $push: { 'Comments.$.reactions': reaction } },
            { new: true }
          );
      
          if (!Story) {
            return res.status(404).json({ message: 'Story or comment not found' });
          }
      
          res.json(Story);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal server error' });
        }

}
}
module.exports = new storyController();