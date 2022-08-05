const {
  findCommentsByArticleId,
  addCommentByArticleId,
} = require("../model/comment.model");

exports.getCommentsByArticleId = (req, res, next) => {
  findCommentsByArticleId(req)
    .then((arrayOfComments) => {
      res.status(200).send({ comments: arrayOfComments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  addCommentByArticleId(req)
    .then(([uploadedComment]) => {
      res.status(201).send({ comments: uploadedComment });
    })
    .catch(next);
};
