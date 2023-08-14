const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const { handleCustomErrors } = require("./controllers/error.controllers")

const app = express();

app.get("/api/topics", getAllTopics);

app.use(handleCustomErrors);

app.use((err, request, response, next) => {
  response.status(500).send({ msg: err });
});

module.exports = { app };
