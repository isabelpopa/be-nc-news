const { seed } = require("../../db/seeds/seed");
const { app } = require("../../app");
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
  test("200: responds with a status of 200 and an array of endpoints on the body", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("GET /api", expect.any(Object));
        expect(body).toHaveProperty("GET /api/topics", expect.any(Object));
        expect(body).toHaveProperty("GET /api/articles", expect.any(Object));
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
        expect(msg).toBe("Not found")
      });
  });
});
