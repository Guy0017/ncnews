const { findArticle } = require("../model/article.model");

exports.getArticle = (req, res, next) => {
  findArticle(req)
    .then((article) => {
      console.log(article);

      res.status(200).send({ article: article });
    })
    .catch(next);
};
