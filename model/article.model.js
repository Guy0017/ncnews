const db = require("../db/connection");

exports.findArticle = (req) => {
  const { article_id: id } = req.params;

  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then(({ rows: article }) => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "No Article With That ID" });
      }

      return article;
    });
};

exports.changeArticle = (req) => {
  const { article_id: id } = req.params;
  const { inc_votes: votes } = req.body;

  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [votes, id]
    )
    .then(({ rows: updatedArticle }) => {
      return updatedArticle;
    });
};
