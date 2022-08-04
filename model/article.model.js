const db = require("../db/connection");

exports.findArticle = (req) => {
  const { article_id: id } = req.params;

  return db
    .query(
      "SELECT articles.*, COUNT(comment_id) :: INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
      [id]
    )
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

exports.findAllArticles = () => {
  return db
    .query(
      "SELECT articles.*, COUNT(comment_id) :: INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;"
    )
    .then(({ rows: arrayOfArticles }) => {
      return arrayOfArticles;
    });
};
