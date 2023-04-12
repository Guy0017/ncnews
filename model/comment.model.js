const db = require("../db/connection");
const { checkArticleIdExists } = require("./article.model");

exports.findCommentsByArticleId = (req) => {
  const { article_id: id } = req.params;
  let { limit, p } = req.query;

  limit ? (limit = parseInt(limit)) : (limit = 10);
  const offset = p ? (parseInt(p) - 1) * parseInt(limit) : 0;

  if (
    offset < 0 ||
    typeof offset !== "number" ||
    (offset !== 0 && !offset) ||
    limit < 1 ||
    typeof limit !== "number" ||
    !limit
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request: Invalid Query",
    });
  }

  const promise = db.query(
    "SELECT comments.*, COUNT(*) OVER() :: INT AS total_count FROM comments WHERE article_id = $1 LIMIT $2 OFFSET $3",
    [id, limit, offset]
  );

  return Promise.all([checkArticleIdExists(id), promise]).then((content) => {
    if (content[0].length === 0) {
      return Promise.reject({ status: 404, msg: "article_id Not Found" });
    }

    const { rows: arrayOfComments, rowCount } = content[1];

    if (p && parseInt(p) === 1 && !rowCount) {
      return arrayOfComments;
    }

    if (p && !rowCount) {
      return Promise.reject({
        status: 404,
        msg: "Not Found",
      });
    }

    return arrayOfComments;
  });
};

exports.changeComment = (req) => {
  const { comment_id: id } = req.params;
  const { inc_votes: votes } = req.body;

  return db
    .query(
      "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;",
      [votes, id]
    )
    .then(({ rows: updatedComment }) => {
      return updatedComment;
    });
};

exports.addCommentByArticleId = (req) => {
  const { body } = req.body;
  const { username: author } = req.body;
  const { article_id } = req.params;

  return checkArticleIdExists(article_id).then((checkArticleIdExists) => {
    if (!checkArticleIdExists.length) {
      return Promise.reject({ status: 404, msg: "article_id Not Found" });
    } else {
      return db
        .query(
          "INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;",
          [body, author, article_id]
        )
        .then(({ rows: uploadedComment }) => {
          return uploadedComment;
        });
    }
  });
};

exports.removeCommentByCommentId = (req) => {
  const { comment_id } = req.params;

  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      comment_id,
    ])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "comment_id Not Found" });
      }
    });
};
