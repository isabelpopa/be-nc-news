const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticle = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "Article_id Not Found",
        });
      } else {
        return article;
      }
    });
};
exports.selectArticles = () => {
    return db.query(`SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count
    FROM articles AS a
    LEFT JOIN comments AS c
    ON a.article_id = c.article_id
    GROUP BY a.article_id
    ORDER BY a.created_at DESC`)
    .then(({ rows }) => {
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
