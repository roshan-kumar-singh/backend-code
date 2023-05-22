const router = require("express").Router();
const storyController = require('../controller/story.controller');

//add story
router.post('/', storyController.addStory)

//Get Story List of following user
router.get('/stories',storyController.getStoryListFollowingUser);

//Like story
router.post("/:_id/like", storyController.likeStory);

// comment story
router.post('/comment/:_id', storyController.commentStory);

//Get comment list
router.get('/get-comments/:_id',storyController.getCommentList);

//Filter Comment List
router.get("/stories/filter", storyController.filterCommentList);

//add react to comment
router.post('/stories/:storyId/comments/:commentId/react', storyController.addReactComment);


module.exports = router;