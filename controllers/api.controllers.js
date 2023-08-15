const endpoints = require("../endpoints.json")

exports.getAllApiEndpoints = (request, response, next) => {
    response.status(200).send(endpoints);
};