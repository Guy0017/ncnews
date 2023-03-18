const express = require("express");
const { getTopics, postTopic } = require("./controller/topic.controller");
const {
  getArticle,
  updateArticle,
  getAllArticles,
  postArticleByUsername,
  deleteArticleByArticleId,
} = require("./controller/article.controller");
const { getUsers, getUser } = require("./controller/user.controller");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentByCommentId,
  updateComment,
} = require("./controller/comment.controller");
const { getEndpoints } = require("./controller/endpoint.controller");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/users", getUsers);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.get("/api/users/:username", getUser);

app.patch("/api/articles/:article_id", updateArticle);

app.patch("/api/comments/:comment_id", updateComment);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.post("/api/articles", postArticleByUsername);

app.post("/api/topics", postTopic);

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.delete("/api/articles/:article_id", deleteArticleByArticleId);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});
app.use((err, req, res, next) => {
  if (
    err.code === "22P02" ||
    err.code === "23502" ||
    err.code === "42703" ||
    err.code === "42601" ||
    err.code === "42703" ||
    err.code === "23503" ||
    err.code === "23505"
  ) {
    res.status(400).send({ msg: "Invalid Input" });
  } else next(err);
});
app.use((err, req, res, next) => {
  console.log(err, "Unhandled Error");
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
