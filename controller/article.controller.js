const {
  findArticle,
  changeArticle,
  findAllArticles,
} = require("../model/article.model");

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

exports.getAllArticles = (req, res, next) => {
  findAllArticles().then((arrayOfArticles) => {
    res.status(200).send({ articles: arrayOfArticles });
  })
  .catch(next)
};
