const db = require("../db/connection");
const format = require("pg-format");

exports.selectCommentsByArticleId = (article_id) => {
  const queryValues = [];
  let baseSqlString = `SELECT * FROM comments `;

  if (article_id) {
    baseSqlString += `WHERE article_id = $1 `;
    queryValues.push(article_id);
  }

  baseSqlString += `ORDER BY created_at DESC;`;

  return db.query(baseSqlString, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.addComment = (article_id, newComment) => {
  const { username, body } = newComment;
  const queryValues = [article_id, username, body];
  const queryStr = format(
    `INSERT INTO comments (article_id, author, body) VALUES (%L) RETURNING *;`,
    queryValues
  );

  if (!username && !body) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }
  if (!username) {
    return Promise.reject({
      status: 400,
      msg: "Username Not Found",
    });
  }
  if (!body) {
    return Promise.reject({
      status: 400,
      msg: "Comment Not Found",
    });
  }
  return db.query(queryStr).then(({ rows }) => {
    return rows[0];
  });
};

exports.deleteComment = (comment_id) => {
  const queryStr = format(
    `DELETE FROM comments WHERE comment_id = %L RETURNING *;`,
    comment_id
  );

  return db.query(queryStr).then(({ rows }) => {
    const comment = rows[0];
    if (!comment) {
      return Promise.reject({
        status: 404,
        msg: "Comment_id Not Found",
      });
    }
  });
};
