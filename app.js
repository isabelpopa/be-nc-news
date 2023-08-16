const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const { handle400s, handleCustomErrors } = require("./controllers/error.controllers");
const { getAllApiEndpoints } = require("./controllers/api.controllers");
const { getArticleById, getAllArticles } = require("./controllers/articles.controllers");
const { getAllCommentsByArticleId } = require("./controllers/comments.controllers");

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api", getAllApiEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId);

app.use((_, response) => {
    response.status(404).send({msg: "Not found"})
})

app.use(handle400s)

app.use(handleCustomErrors);

app.use((err, request, response, next) => {
  response.status(500).send({ msg: err });
});

module.exports = { app };