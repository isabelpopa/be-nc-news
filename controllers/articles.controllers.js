const { request } = require("express");
const { selectArticle, selectArticles, patchArticle } = require("../models/articles.models");

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  selectArticle(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getAllArticles = (request, response, next) => {
  selectArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
exports.patchArticleById = (request, response, next) => {
  const { article_id } = request.params;
  const patchedArticle = request.body;
  patchArticle(article_id, patchedArticle)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};


