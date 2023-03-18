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

exports.findAllArticles = (req) => {
  // Destructure and assign default values

  let { sortBy, topic, order, limit, p } = req.query;

  sortBy ??= "created_at";
  order = order ? order.toUpperCase() : "DESC";
  limit ??= 10;

  const firstIndex = p ? (parseInt(p) - 1) * parseInt(limit) : 0;
  const lastIndex = p ? parseInt(p) * parseInt(limit) : parseInt(limit);

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

  if (
    firstIndex < 0 ||
    typeof firstIndex !== "number" ||
    (firstIndex !== 0 && !firstIndex) ||
    lastIndex < 1 ||
    typeof lastIndex !== "number" ||
    (lastIndex !== 0 && !lastIndex)
  ) {
    invalidQuery = true;
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

  // Concatinate database query string

  let queryStr =
    "SELECT articles.*, COUNT(comment_id) :: INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id ";

  const injectArr = [];

  if (topic) {
    queryStr += "WHERE articles.topic = $1 ";
    injectArr.push(topic);
  }

  queryStr += `GROUP BY articles.article_id ORDER BY ${sortBy} ${order};`;

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

      const { rows: arrayOfArticles } = array[0];
      const total_count = arrayOfArticles.length;

      // paginate

      arrayOfArticles.map((article) => {
        article.total_count = total_count;
      });

      const paginatedArticles = arrayOfArticles.slice(firstIndex, lastIndex);

      if (firstIndex > total_count) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      }

      return paginatedArticles;
    });
  }

  // No topic promise starts here

  return db.query(queryStr, injectArr).then(({ rows: arrayOfArticles }) => {
    const total_count = arrayOfArticles.length;

    arrayOfArticles.map((article) => {
      article.total_count = total_count;
    });

    const paginatedArticles = arrayOfArticles.slice(firstIndex, lastIndex);

    if (firstIndex > total_count) {
      return Promise.reject({
        status: 404,
        msg: "Not Found",
      });
    }
    return paginatedArticles;
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
