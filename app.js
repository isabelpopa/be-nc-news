const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const { handleCustomErrors } = require("./controllers/error.controllers");
const { getAllApiEndpoints } = require("./controllers/api.controllers");

const app = express();

app.get("/api/topics", getAllTopics);
app.get("/api", getAllApiEndpoints);

app.use((_, response) => {
    response.status(404).send({msg: "Not found"})
})

app.use(handleCustomErrors);

app.use((err, request, response, next) => {
  response.status(500).send({ msg: err });
});

module.exports = { app };