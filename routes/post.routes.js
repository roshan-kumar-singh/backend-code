const router = require("express").Router();
const postController = require('../controller/post.controller');


//create a post
router.post("/",postController.createPost);

//Get Post List of following user
router.get("/following/",postController.getPostListFollowingUser);

//Like post
router.post("/:_id/like",postController.likePost);


//Add comment to a post
router.post("/:_id/comment",postController.addCommentPost );

//Get comment list
router.get("/:_id/getcomments",postController.getCommentList);

//Filter comment list
router.get("/:postId/comments",postController.filterCommentList );


//add reaction to comment
router.post("/:commentId/reactions", postController.addReactionComment);



module.exports = router;