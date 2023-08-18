const db = require("../db/connection");
const format = require("pg-format");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    const user = rows[0];
    if (!user) {
      return Promise.reject({
        status: 404,
        msg: "Not Found",
      });
    } else {
      return rows;
    }
  });
};
