const express = require("express");
const { getTopics } = require("./controller/topic.controller");
const {
  getArticle,
  updateArticle,
  getAllArticles,
} = require("./controller/article.controller");
const { getUsers } = require("./controller/user.controller");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("./controller/comment.controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/users", getUsers);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.patch("/api/articles/:article_id", updateArticle);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});





// app.use((err, req, res, next) => {
//   if (err.status) {
//     res.status(err.status).send({ msg: err.msg });
//   } else next(err);
// });

// app.use((err, req, res, next) => {
//   if (err.code === '22P02" || "23502" || "42703" || "42601" || "42703') {
//     res.status(400).send({ msg: 'Invalid input' });
//   } else next(err);
// });

// app.use((err, req, res, next) => {
//   console.log(err);
//   res.status(500).send({ msg: 'Internal Server Error' });
// });









app.use((err, req, res, next) => {
  console.log(err)
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err) })
app.use((err,req,res,next) => {


  if (err.code === "22P02" || "23502" || "42703" || "42601" || "42703") {
    res.status(400).send({ msg: "Bad Request" });
  } else next(err)
  
});
app.use((err, req,res,next) => {

  console.log(err, 'unhandled error')
  res.status(500).send({msg: 'internal server error'})
})



module.exports = app;
