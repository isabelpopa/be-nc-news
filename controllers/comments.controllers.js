const {
  selectCommentsByArticleId,
  addComment,
  deleteComment
} = require("../models/comments.models");
const { selectArticle } = require("../models/articles.models");

exports.getAllCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const promises = [selectCommentsByArticleId(article_id)];

  if (article_id) {
    promises.push(selectArticle(article_id));
  }

  Promise.all(promises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (request, response, next) => {
  const { article_id } = request.params;
  const newComment = request.body;
  addComment(article_id, newComment)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  deleteComment(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
