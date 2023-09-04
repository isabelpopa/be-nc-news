const cors = require("cors");
const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const {
  handle400s,
  handleCustomErrors,
} = require("./controllers/error.controllers");
const { getAllApiEndpoints } = require("./controllers/api.controllers");
const {
  getArticleById,
  getAllArticles,
  patchArticleById,
} = require("./controllers/articles.controllers");
const {
  getAllCommentsByArticleId,
  postComment,
  deleteCommentById,
} = require("./controllers/comments.controllers");
const { getAllUsers } = require("./controllers/users.controllers");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api", getAllApiEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/users", getAllUsers);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use((_, response) => {
  response.status(404).send({ msg: "Not Found" });
});

app.use(handle400s);

app.use(handleCustomErrors);

app.use((err, request, response, next) => {
  response.status(500).send({ msg: err });
});

module.exports =  app;
