const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");

afterAll(() => db.end());
beforeEach(() => seed(data));

describe("GET /api/topics", () => {
  test("responds with status 200", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test('responds with status 404 and "Not Found" to an invalid request', () => {
    return request(app)
      .get("/api/invalid_request")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not Found");
      });
  });
  test("responds with an array of objects", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);

        expect(body.length).toBeGreaterThan(0);

        body.forEach((itemObj) => {
          expect(itemObj).toBeInstanceOf(Object);
        });
      });
  });
  test('each object has keys: "slug" and "description" and both have string as their value', () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        expect(body.length).toBeGreaterThan(0);

        body.forEach((itemObj) => {
          expect(itemObj).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("responds with 200 for valid request article_id 1", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  test("responds object with description as key and array containing an object with information for valid request where article_id 1", () => {
    return request(app)
      .get("/api/articles/1")
      .then(({ body }) => {
        const arrayHoldingObj = body.article;
        const infoObj = body.article[0];

        expect(body).toBeInstanceOf(Object);
        expect(Array.isArray(arrayHoldingObj)).toBe(true);
        expect(infoObj).toBeInstanceOf(Object);
      });
  });
  test("object holding information has right keys and values for a valid request", () => {
    return request(app)
      .get("/api/articles/1")
      .then(({ body }) => {
        const [infoObj] = body.article;

        expect(infoObj).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test('status: 400 and "Bad Request" for not an ID', () => {
    return request(app)
      .get("/api/articles/not_an_ID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test('status: 404 and "No Article With That ID" for valid ID but data does not exist', () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No Article With That ID");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("responds with status 200", () => {
    const patch = {
      inc_votes: 1,
    };

    return request(app).patch("/api/articles/2").send(patch).expect(200);
  });
  test("responds with updated object with key describing the data and the updated object article its value", () => {
    const patch = {
      inc_votes: 1,
    };

    return request(app)
      .patch("/api/articles/2")
      .send(patch)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.updatedArticle).toBeInstanceOf(Object);
      });
  });
  test("the updated object contains the correct keys and information type, with the votes incremented by the request body", () => {
    const patch = {
      inc_votes: 1,
    };

    return request(app)
      .patch("/api/articles/2")
      .send(patch)
      .then(({ body }) => {
        expect(body.updatedArticle).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: 1,
          })
        );
      });
  });
  test("votes is decremented by the request body", () => {
    const patch = {
      inc_votes: -100,
    };

    return request(app)
      .patch("/api/articles/2")
      .send(patch)
      .then(({ body }) => {
        expect(body.updatedArticle).toEqual(
          expect.objectContaining({
            votes: -100,
          })
        );
      });
  });
  test("status: 400 and 'Bad Request' for malformed request body", () => {
    const patch = {};

    return request(app)
      .patch("/api/articles/2")
      .send(patch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status: 400 and 'Bad Request' for incorrect value type", () => {
    const patch = {
      inc_votes: "notNumber",
    };

    return request(app)
      .patch("/api/articles/2")
      .send(patch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  test("responds with status 200", () => {
    return request(app).get("/api/topics").expect(200);
  });

  test("responds with an array of objects", () => {
    return request(app)
      .get("/api/users")
      .then(({ body }) => {
        const usersArray = body.usersArray;
        expect(Array.isArray(usersArray)).toBe(true);

        expect(usersArray.length).toBeGreaterThan(0);

        usersArray.forEach((itemObj) => {
          expect(itemObj).toBeInstanceOf(Object);
        });
      });
  });
  test('each object has keys: "username", "name" and "avatar_url" and all have string as their value', () => {
    return request(app)
      .get("/api/users")
      .then(({ body }) => {
        const usersArray = body.usersArray;
        expect(usersArray.length).toBeGreaterThan(0);

        usersArray.forEach((itemObj) => {
          expect(itemObj).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id (comment count)", () => {
  test("status: 200 and added comment to article response object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const [infoObj] = body.article;

        expect(infoObj).toEqual(
          expect.objectContaining({
            comment_count: expect.any(Number),
          })
        );
      });
  });

  test("status: 200, response where article has no corresponding comment should show count to be 0", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const [infoObj] = body.article;

        expect(infoObj).toEqual(
          expect.objectContaining({
            comment_count: 0,
          })
        );
      });
  });
});

describe("GET /api/articles", () => {
  test("status: 200", () => {
    return request(app).get("/api/articles").expect(200);
  });
  test("response is an object with key as description and value of an object of array holding of objects holding data requested", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const arrayOfObjects = body.articles;

        expect(body).toBeInstanceOf(Object);
        expect(Array.isArray(arrayOfObjects)).toBe(true);
        expect(arrayOfObjects.length).toBeGreaterThan(0);

        arrayOfObjects.forEach((infoObj) => {
          expect(infoObj).toBeInstanceOf(Object);
        });
      });
  });
  test("each object within the array contains the correct keys and expected value types", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const arrayOfObjects = body.articles;

        expect(arrayOfObjects.length).toBeGreaterThan(0);

        arrayOfObjects.forEach((infoObj) => {
          expect(infoObj).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
});
