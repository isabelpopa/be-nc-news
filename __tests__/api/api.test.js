const { seed } = require("../../db/seeds/seed");
const app = require("../../app");
const request = require("supertest");
const connection = require("../../db/connection");
const testData = require("../../db/data/test-data");

afterAll(() => {
  return connection.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("GET /api/topics", () => {
  test("200: responds with a status of 200", () => {
    return request(app).get("/api/topics").expect(200);
  });

  test("200: responds with an array of topics on the body", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("description", expect.any(String));
          expect(topic).toHaveProperty("slug", expect.any(String));
        });
      });
  });
});

describe("GET /api", () => {
  test("200: responds with a status of 200 and an object describing all the available endpoints on the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body).toMatchObject({
          "GET /api": {
            description:
              "serves up a json representation of all the available endpoints of the api",
          },
          "GET /api/topics": {
            description: "serves an array of all topics",
            queries: [],
            exampleResponse: {
              topics: [{ slug: "football", description: "Footie!" }],
            },
          },
          "GET /api/articles": {
            description: "serves an array of all articles",
            queries: ["author", "topic", "sort_by", "order"],
            exampleResponse: {
              articles: [
                {
                  title: "Seafood substitutions are increasing",
                  topic: "cooking",
                  author: "weegembump",
                  body: "Text from the article..",
                  created_at: "2018-05-30T15:59:13.341Z",
                  votes: 0,
                  comment_count: 6,
                },
              ],
            },
          },
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with a status of 200 and an object representing article_id 1", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400: responds with a status of 400 and a custom message of Bad Request", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  test("404: responds with a status of 404 and a custom message of Article_id Not Found", () => {
    return request(app)
      .get("/api/articles/99")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Article_id Not Found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with a status of 200", () => {
    return request(app).get("/api/articles").expect(200);
  });
  test("Responds with an array representing all articles, containing the required properties", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(String));
          expect(articles[0]).toMatchObject({
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            created_at: "2020-11-03T09:12:00.000Z",
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
      });
  });
  test("Articles should be sorted by date as default, in descending order", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("Articles should not have a body property present on any of the article objects", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});
describe("FEATURE: GET /api/articles (queries)", () => {
  test("Articles should be filtered by topic=mitch, sorted by author and ordered ascending ", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=author&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy("author", { descending: false });
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              comment_count: expect.any(String),
              topic: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              created_at: expect.any(String),
              article_img_url: expect.any(String),
            })
          );
        });
        expect(articles[0]).toStrictEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          comment_count: "11",
          topic: "mitch",
          votes: 100,
          author: "butter_bridge",
          created_at: "2020-07-09T20:11:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("Articles should be filtered by topic=cats, sorted by votes and ordered descending by default ", () => {
    return request(app)
      .get("/api/articles?topic=cats&sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(1);
        expect(articles).toBeSortedBy("votes", { descending: true });
        articles.forEach((article) => {
          expect(article).toHaveProperty("topic", "cats");
        });
        expect(articles[0]).toStrictEqual({
          article_id: 5,
          votes: 0,
          comment_count: "2",
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          created_at: "2020-08-03T13:14:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("200: responds with 200 and an empty array when topic has no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toEqual([]);
        expect(articles.length).toBe(0);
      });
  });
  test("400: responds with 400 and 'Bad sort_by Request' when sort_by is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=banana")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad sort_by Request");
      });
  });
  test("400: responds with 400 and 'Bad order Request' when order is invalid", () => {
    return request(app)
      .get("/api/articles?order=banana")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad order Request");
      });
  });
  test("404: responds with 404 and 'Not Found' when topic is not found", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not Found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with a status of 200 and an object representing article_id 1", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
          expect(comments[0]).toMatchObject({
            comment_id: 5,
            body: "I hate streaming noses",
            votes: 0,
            author: "icellusedkars",
            article_id: 1,
            created_at: "2020-11-03T21:00:00.000Z",
          });
        });
      });
  });
  test("200: Returns 200 when article_id exists but the comments array is empty", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
  test("Comments should be sorted by most recent comments first.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("400: responds with a status of 400 and a custom message of Bad Request", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  test("404: responds with a status of 404 and a custom message of Article_id Not Found", () => {
    return request(app)
      .get("/api/articles/99/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Article_id Not Found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with a status of 201 and the comment object that has been sent", () => {
    const newComment = {
      body: "The answer is doughnuts",
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const { comment } = response.body;
        expect(comment).toMatchObject({
          article_id: 1,
          author: "butter_bridge",
          body: "The answer is doughnuts",
          votes: 0,
          ...comment,
        });
        expect(comment).toHaveProperty("created_at", expect.any(String));
        expect(comment).toHaveProperty("votes", expect.any(Number));
        expect(comment).toHaveProperty("body", expect.any(String));
        expect(comment).toHaveProperty("author", expect.any(String));
        expect(comment).toHaveProperty("article_id", expect.any(Number));
      });
  });
  test("400: Should return Bad request when the comment has a malformed body", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({})
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: Should return 'Username Not Found' when the comment is missing username field", () => {
    const newComment = {
      body: "The answer is doughnuts",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Username Not Found");
      });
  });
  test("400: Should return 'Comment Not Found' when the comment is missing comment field", () => {
    const newComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Comment Not Found");
      });
  });
  test("400: Should return 'Bad Request' when the article_id is invalid", () => {
    const newComment = {
      body: "The answer is doughnuts",
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/banana/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  test("404: Should return 'Article_id Not Found' when the article_id is out of range", () => {
    const newComment = {
      body: "The answer is doughnuts",
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not Found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with a status of 200", () => {
    return request(app).get("/api/users").expect(200);
  });
  test("200: responds with an array of users on the body", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
  test("404: responds with a status of 404 Not Found", () => {
    return request(app)
      .get("/api/usersss")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not Found");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("204: responds with a status of 204", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("404: Should return 'Not Found' when comment_id is out of range", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Comment_id Not Found");
      });
  });
  test("400: Should return 'Bad Request' when the comment_id is an invalid id", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with a status of 200 and the updated article object that has been patched", () => {
    const patchedArticle = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/1")
      .send(patchedArticle)
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 110,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("200: responds with the patched votes, when subtracting a value", () => {
    const patchedArticle = { inc_votes: -50 };
    return request(app)
      .patch("/api/articles/1")
      .send(patchedArticle)
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article.votes).toBe(50);
      });
  });
  test("400: Should return 'Bad request' when the patch has a malformed body", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: Should return 'Bad Request' when the patch is not a number", () => {
    const patchedArticle = {
      votes: "banana",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(patchedArticle)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: Should return 'Bad request' when the article_id is invalid", () => {
    const patchedArticle = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/banana")
      .send(patchedArticle)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  test("404: Should return 'Article_id Not Found' when the article_id is out of range", () => {
    const patchedArticle = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/999")
      .send(patchedArticle)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Article_id Not Found");
      });
  });
});

describe("ALL /notapath", () => {
  test("404: responds with a status of 404 and a custom message when the path is not found", () => {
    return request(app)
      .get("/api/banana")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not Found");
      });
  });
});
