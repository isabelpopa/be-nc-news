const db = require("../db/connection");
const format = require("pg-format");

exports.selectCommentsByArticleId = (article_id) => {
    return db.query(`SELECT * 
    FROM comments 
    WHERE article_id = $1
    ORDER BY created_at DESC`, [article_id])
    .then(({ rows }) => {
      const comment = rows[0];
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: "Article_id Not Found",
        });
      } else {
        return rows;
      }
    });
  };