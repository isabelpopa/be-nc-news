const db = require("../db/connection");
const format = require("pg-format");

exports.selectCommentsByArticleId = (article_id) => {
    const queryValues = [];
    let baseSqlString = `SELECT * FROM comments `

    if (article_id) {
        baseSqlString += `WHERE article_id = $1 `
        queryValues.push(article_id)
    }

    baseSqlString += `ORDER BY created_at DESC`

    return db.query(baseSqlString, queryValues)
    .then(({ rows }) => {
        return rows;
    });
  };