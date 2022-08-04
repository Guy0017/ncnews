const express = require("express");
const { getTopics } = require("./controller/topic.controller");
const {
  getArticle,
  updateArticle,
  getAllArticles,
} = require("./controller/article.controller");
const { getUsers } = require("./controller/user.controller");
const { getCommentsByArticleId } = require("./controller/comment.controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/users", getUsers);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.patch("/api/articles/:article_id", updateArticle);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  }

  if (err.code === "22P02" || "23502") {
    res.status(400).send({ msg: "Bad Request" });
  }
});

module.exports = app;
