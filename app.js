const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const { handle400s, handleCustomErrors } = require("./controllers/error.controllers");
const { getAllApiEndpoints } = require("./controllers/api.controllers");
const { getArticleById } = require("./controllers/articles.controllers")

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api", getAllApiEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.use((_, response) => {
    response.status(404).send({msg: "Not found"})
})

app.use(handle400s)

app.use(handleCustomErrors);

app.use((err, request, response, next) => {
  response.status(500).send({ msg: err });
});

module.exports = { app };