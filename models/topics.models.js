const db = require("../db/connection");

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
