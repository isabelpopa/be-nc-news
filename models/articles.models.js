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
exports.selectArticles = (topic, sort_by = "created_at", order) => {
  const acceptedValuesSort = ["title", "topic", "author", "body", "created_at", "votes", "article_img_url"];
  const acceptedValuesTopic = ["mitch", "cats", "coding", "football", "cooking"]
  const queryValues = [];

  if (!acceptedValuesSort.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Bad sort_by request' });
  }
  if (topic && !acceptedValuesTopic.includes(topic)) {
    return Promise.reject({ status: 400, msg: 'Bad topic request' });
  }

  let baseSqlStr = `SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count
    FROM articles AS a
    LEFT JOIN comments AS c
    ON a.article_id = c.article_id`;

    if (topic) {
      baseSqlStr += ` WHERE a.topic = $1`;
      queryValues.push(topic);
    }

    baseSqlStr += ` GROUP BY a.article_id`

    baseSqlStr += ` ORDER BY ${sort_by} ${order === "asc" ? "ASC" : "DESC"}`;

    return db.query(baseSqlStr, queryValues)
    .then(({rows}) => {
      const topic = rows[0];
      if (!topic) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      } else {
        return rows;
      }
    })
  };
