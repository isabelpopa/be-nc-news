const { request } = require("express");
const { selectTopics } = require("../models/topics.models");

exports.getAllTopics = (request, response, next) => {
  selectTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
