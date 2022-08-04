const { findCommentsByArticleId } = require("../model/comment.model");

exports.getCommentsByArticleId = (req, res, next) => {
  findCommentsByArticleId(req)
    .then((arrayOfComments) => {

      res.status(200).send({ comments: arrayOfComments });
    })
    .catch(next);
};
