const express = require("express");
const { getTopics } = require("./controller/topic.controller");
const {
  getArticle,
  updateArticle,
} = require("./controller/article.controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.patch("/api/articles/:article_id", updateArticle);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Bad path" });
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
