const { request } = require("express");
const { selectCommentsByArticleId } = require("../models/comments.models");

exports.getAllCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params;
    selectCommentsByArticleId(article_id)
      .then((comments) => {
        response.status(200).send({ comments });
      })
      .catch((err) => {
        next(err);
      });
  };