const db = require("../db/connection");
const { checkArticleIdExists } = require("./article.model");

exports.findCommentsByArticleId = (req) => {
  const { article_id: id } = req.params;

  const promise = db.query("SELECT * FROM comments WHERE article_id = $1", [
    id,
  ]);

  return Promise.all([checkArticleIdExists(id), promise]).then((content) => {
    if (content[0].length === 0) {
      return Promise.reject({ status: 404, msg: "article_id Not Found" });
    }

    const { rows: arrayOfComments } = content[1];

    return arrayOfComments;
  });
};

exports.addCommentByArticleId = (req) => {
  const { body } = req.body;
  const { username: author } = req.body;
  const { article_id } = req.params;

  return db
    .query(
      "INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;",
      [body, author, article_id]
    )
    .then(({ rows: uploadedComment }) => {
      return uploadedComment;
    });
};
