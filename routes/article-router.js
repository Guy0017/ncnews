const {
  getArticle,
  getAllArticles,
  postArticleByUsername,
  updateArticle,
  deleteArticleByArticleId,
} = require("../controller/article.controller");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controller/comment.controller");

const articleRouter = require("express").Router();

articleRouter
  .route("/")
  .get(getAllArticles)
  .post(postArticleByUsername);

articleRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(updateArticle)
  .delete(deleteArticleByArticleId);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articleRouter;
