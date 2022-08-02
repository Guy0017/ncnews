const { findArticle, changeArticle } = require("../model/article.model");

exports.getArticle = (req, res, next) => {
  findArticle(req)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  changeArticle(req)
    .then(([updatedArticle]) => {
      res.status(200).send({ updatedArticle: updatedArticle });
    })
    .catch(next);
};
