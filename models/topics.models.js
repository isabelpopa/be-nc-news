const db = require("../db/connection");
const format = require("pg-format");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    const topic = rows[0];
    if (!topic) {
      return Promise.reject({
        status: 404,
        msg: "Not Found",
      });
    } else {
      return rows;
    }
  });
};
