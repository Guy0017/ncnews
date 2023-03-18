const {
  updateComment,
  deleteCommentByCommentId,
} = require("../controller/comment.controller");

const commentRouter = require("express").Router();

commentRouter
  .route("/:comment_id")
  .patch(updateComment)
  .delete(deleteCommentByCommentId);

module.exports = commentRouter;
