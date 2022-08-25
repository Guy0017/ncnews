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
  req,
  sortBy = "created_at",
  topic,
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
    "comment_count"
  ];

  const validQuery = ["sortBy", "topic", "order"];
  const validAscOrDesc = ["DESC", "ASC"];
  const reqQueryKeys = Object.keys(req.query);

  let invalidQuery = false;

  if (reqQueryKeys) {
    reqQueryKeys.forEach((reqKey) => {
      if (!validQuery.includes(reqKey)) {
        invalidQuery = true;
      }

      if (reqKey === "sortBy") {
        sortBy = req.query.sortBy;
      }

      if (reqKey === "topic") {
        topic = req.query.topic;
      }

      if (reqKey === "order") {
        order = req.query.order.toUpperCase();
      }
    });
  }

  if (invalidQuery) {
    return Promise.reject({ status: 400, msg: "Bad Request: Invalid Query" });
  }

  if (!validSortBy.includes(sortBy) || !validAscOrDesc.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request: Invalid Order/Sortby Query",
    });
  }

  let queryStr =
    "SELECT articles.*, COUNT(comment_id) :: INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id ";

  const injectArr = [];

  if (topic) {
    queryStr += "WHERE articles.topic = $1 ";
    injectArr.push(topic);
  }

  queryStr += `GROUP BY articles.article_id ORDER BY ${sortBy} ${order};`;
  
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

      const { rows: arrayOfArticles } = array[0]

      return arrayOfArticles;
    });
  } 

  return db.query(queryStr, injectArr).then(({ rows: arrayOfArticles }) => {
    return arrayOfArticles;
  });
};

exports.checkArticleIdExists = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then(({ rows: checkExist }) => {
      return checkExist;
    });
};
