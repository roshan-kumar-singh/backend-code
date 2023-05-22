const Post = require("../model/post");
class postController {
    createPost= 
     async (req, res) => {
        const { userId, mediaType, mediaUrl } = req.body;
      
        try {
          const newPost = new Post({
            userId,
            mediaType,
            mediaUrl
          });
          
          const savedPost = await newPost.save();
          res.status(200).json({ message: 'Post added successfully', post: savedPost });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Server Error' });
        }
     }
//user can get all post 
 getPostListFollowingUser =  async (req, res) => {
    try {
      const post = await Post.find();
      return res.json(post);
  
      
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
  //user can like other post
  likePost =  async (req, res) => {
    try {
      const { _id } = req.params; //post id
      const { userId } = req.body;//user id
  
      const post = await Post.findOne({ _id });
      if (post.Likes.includes(userId)) {
        return res.status(400).json({ message: 'You have already liked this story' });
      }
      post.Likes.push(userId);
      await post.save();
  
      res.json({ message: 'post liked successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
//user can comment on post
  addCommentPost = async (req, res) => {
    try {
      const { _id } = req.params;
      const { userId, text } = req.body;
      const post = await Post.findOne({_id});
      const newComment = {
        userId,
        text
      };
  
      post.Comments.push(newComment);
      await post.save();
  
      res.json({ message: 'Comment added successfully', post });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
//all comments
  getCommentList = async (req, res) => {
    // const { postId } = req.params;
  
    // try {
    //   const post = await Post.findById(postId);
    //   if (!post) {
    //     return res.status(404).json({ message: "Post not found" });
    //   }
  
    //   res.status(200).json(post.comments);
    // } catch (err) {
    //   res.status(500).json(err);
    // }
    try {
      const { _id } = req.params;
      const post = await Post.findOne({_id}); // Populating the userId field to get the username of the commenter
      if (!post) {
        return res.status(404).json({ message: 'post not found' });
      }
      res.json({ comments: post.Comments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }

  }

  filterCommentList = async (req, res) => {
    const { postId } = req.params;
    const { sort } = req.query;
  
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      let comments = post.comments;
  
      switch (sort) {
        case "new":
          comments = comments.sort((a, b) => b.createdAt - a.createdAt);
          break;
        case "old":
          comments = comments.sort((a, b) => a.createdAt - b.createdAt);
          break;
        case "likes":
          comments = comments.sort((a, b) => b.reactions.likes - a.reactions.likes);
          break;
        case "reactions":
          comments = comments.sort((a, b) => b.reactions.count - a.reactions.count);
          break;
        default:
          break;
      }
  
      res.status(200).json(comments);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  addReactionComment = async (req, res) => {
    const { userId, emoji } = req.body;
    const { commentId } = req.params;
  
    try {
      const comment = await Comment.findById(commentId);
  
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
  
      const reaction = {
        user: userId,
        emoji,
      };
  
      comment.reactions.push(reaction);
  
      const updatedComment = await comment.save();
  
      res.status(200).json(updatedComment);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
module.exports = new postController();