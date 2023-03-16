const {
  findArticle,
  changeArticle,
  findAllArticles,
  addCommentByUsername,
} = require("../model/article.model");

exports.getArticle = (req, res, next) => {
  findArticle(req)
    .then((article) => {
      res.status(200).send({ articles: article });
    })
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  changeArticle(req)
    .then((updatedArticle) => {
      res.status(200).send({ articles: updatedArticle });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  findAllArticles(req)
    .then((arrayOfArticles) => {
      res.status(200).send({ articles: arrayOfArticles });
    })
    .catch(next);
};

exports.postArticleByUsername = (req, res, next) => {
  addCommentByUsername(req)
    .then((addedArticle) => { 
      res.status(201).send({ articles: addedArticle });
    })
    .catch(next);
};
