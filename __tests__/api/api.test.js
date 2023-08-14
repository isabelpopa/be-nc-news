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

describe('GET /api/topics', () => {
    test('200: responds with a status of 200', () => {
      return request(app).get('/api/topics').expect(200);
    });

    test('200: responds with an array of topics on the body', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
          const {topics} = body
          expect(topics).toBeInstanceOf(Array);
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toHaveProperty('description', expect.any(String));
            expect(topic).toHaveProperty('slug', expect.any(String));
          });
        });
    });
  });
