const db = require("../db/connection");
const { checkTopicExists } = require("../model/topic.model");

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

exports.findAllArticles = (
  sortBy = "created_at",
  topic = "",
  order = "DESC"
) => {
  const validSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
  ];

  order = order.toUpperCase()
  

  const validAscOrDesc = ["DESC", "ASC"];

  if (!validSortBy.includes(sortBy) || !validAscOrDesc.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let query =
    "SELECT articles.*, COUNT(comment_id) :: INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id ";
  const injectArr = [];

  if (topic) {
    query += "WHERE articles.topic = $1 ";
    injectArr.push(topic);
  }

  query += "GROUP BY articles.article_id ";
  query += `ORDER BY articles.${sortBy} ${order};`;

  if (topic) {
    return Promise.all([
      db.query(query, injectArr),
      checkTopicExists(topic),
    ]).then((content) => {
      if (content[1].length === 0) {
        return Promise.reject({
          status: 400,
          msg: "Bad Request: Topic Does Not Exist",
        })
      }

      return content[0].rows;
    });
  }

  return db.query(query, injectArr).then(({ rows: arrayOfArticles }) => {
    return arrayOfArticles;
  })
};

exports.checkArticleIdExists = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then(({ rows: checkExist }) => {
      return checkExist;
    });
};
