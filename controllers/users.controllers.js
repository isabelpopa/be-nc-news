const { request } = require("express");
const { selectUsers } = require("../models/users.models");

exports.getAllUsers = (request, response, next) => {
    selectUsers()
    .then((users) => {
        response.status(200).send({ users })
    })
    .catch((err) => {
        next(err)
    })
};