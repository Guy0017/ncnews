const db = require("../db/connection");
const { checkTopicExists } = require("../utils/utils");

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

exports.findAllArticles = (req) => {
  // Destructure and assign default values

  let { sortBy, topic, order, limit, p } = req.query;

  sortBy ??= "created_at";
  order = order ? order.toUpperCase() : "DESC";
  limit ? (limit = parseInt(limit)) : (limit = 10);
  const offset = p ? (parseInt(p) - 1) * parseInt(limit) : 0;

  // Validation lists for sanitising request. AMEND to add functionality

  const validSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];

  const validQuery = ["sortBy", "topic", "order", "limit", "p"];
  const validAscOrDesc = ["DESC", "ASC"];

  // Sanitise query elements against validation lists

  const reqQueryKeys = Object.keys(req.query);

  let invalidQuery = false;

  if (reqQueryKeys) {
    reqQueryKeys.forEach((reqKey) => {
      if (!validQuery.includes(reqKey)) {
        invalidQuery = true;
      }
    });
  }

  if (!validSortBy.includes(sortBy) || !validAscOrDesc.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request: Invalid Order/Sortby Query",
    });
  }

  if (
    offset < 0 ||
    typeof offset !== "number" ||
    (offset !== 0 && !offset) ||
    limit < 1 ||
    typeof limit !== "number" ||
    !limit
  ) {
    invalidQuery = true;
  }

  if (invalidQuery) {
    return Promise.reject({ status: 400, msg: "Bad Request: Invalid Query" });
  }

  // Concatinate database query string

  let queryStr =
    "SELECT articles.*, COUNT(comment_id) :: INT AS comment_count, COUNT(*) OVER() :: INT AS total_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id ";

  const injectArr = [];

  if (topic) {
    queryStr += "WHERE articles.topic = $1 ";
    injectArr.push(topic);
  }

  queryStr += `GROUP BY articles.article_id ORDER BY ${sortBy} ${order} `;

  queryStr += `LIMIT ${topic ? "$2" : "$1"} OFFSET ${topic ? "$3" : "$2"};`;
  injectArr.push(limit, offset);

  // execute promises: 2 routes, one for if topic is present, the other for when no topic is present

  if (topic) {
    return Promise.all([
      db.query(queryStr, injectArr),
      checkTopicExists(topic),
    ]).then((array) => {
      if (array[1].length === 0) {
        return Promise.reject({
          status: 400,
          msg: "Bad Request: Topic Does Not Exist",
        });
      }

      const { rows: arrayOfArticles, rowCount } = array[0];

      if (p && !rowCount) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      }

      return arrayOfArticles;
    });
  }

  // No topic promise starts here

  return db
    .query(queryStr, injectArr)
    .then(({ rows: arrayOfArticles, rowCount }) => {
      if (p && !rowCount) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      }
      return arrayOfArticles;
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

exports.addArticleByUsername = (req) => {
  const { title, topic, author, body } = req.body;

  return db
    .query(
      "INSERT INTO articles (title, topic, author, body) VALUES ($1, $2, $3, $4) RETURNING *;",
      [title, topic, author, body]
    )
    .then(({ rows: uploadedArticle }) => {
      return db
        .query(
          "SELECT articles.*, COUNT(comment_id) :: INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
          [uploadedArticle[0].article_id]
        )
        .then(({ rows: uploadedArticle }) => {
          return uploadedArticle;
        });
    });
};

exports.checkArticleIdExists = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then(({ rows: checkExist }) => {
      return checkExist;
    });
};

exports.removeArticleByArticleId = (req) => {
  const { article_id } = req.params;

  return db
    .query("DELETE FROM articles WHERE article_id = $1 RETURNING *;", [
      article_id,
    ])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "article_id Not Found" });
      }
    });
};
