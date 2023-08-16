const { selectCommentsByArticleId } = require("../models/comments.models");
const { selectArticle } = require("../models/articles.models");

exports.getAllCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params;
    const promises = [selectCommentsByArticleId(article_id)];

    if (article_id) {
        promises.push(selectArticle(article_id))
    }

    Promise.all(promises)
      .then((resolvedPromises) => {
        const comments = resolvedPromises[0]
        response.status(200).send({ comments });
      })
      .catch((err) => {
        next(err);
      });
  };