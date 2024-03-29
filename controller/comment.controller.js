const {
  findCommentsByArticleId,
  addCommentByArticleId,
  removeCommentByCommentId,
  changeComment,
} = require("../model/comment.model");

exports.getCommentsByArticleId = (req, res, next) => {
  findCommentsByArticleId(req)
    .then((arrayOfComments) => {
      res.status(200).send({ comments: arrayOfComments });
    })
    .catch(next);
};

exports.updateComment = (req, res, next) => {
  changeComment(req)
    .then((comment) => {
      res.status(200).send({ comments: comment });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  addCommentByArticleId(req)
    .then((uploadedComment) => {
      res.status(201).send({ comments: uploadedComment });
    })
    .catch(next);
};

exports.deleteCommentByCommentId = (req, res, next) => {
  removeCommentByCommentId(req)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
