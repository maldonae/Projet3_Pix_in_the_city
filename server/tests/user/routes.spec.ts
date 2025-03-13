// Import the supertest library for making HTTP requests
import supertest from "supertest";

// Import the Express application
import app from "../../src/app";

// Import databaseClient
import databaseClient from "../../database/client";

import type { Result, Rows } from "../../database/client";

// Restore all mocked functions after each test
afterEach(() => {
  jest.restoreAllMocks();
});

// Test suite for the GET /api/users route
describe("GET /api/users", () => {
  it("should fetch users successfully", async () => {
    // Mock empty rows returned from the database
    const rows = [] as Rows;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [rows, []]);

    // Send a GET request to the /api/users endpoint
    const response = await supertest(app).get("/api/users");

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(rows);
  });
});

// Test suite for the GET /api/users/:id route
describe("GET /api/users/:id", () => {
  it("should fetch a single user successfully", async () => {
    // Mock rows returned from the database
    const rows = [{}] as Rows;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [rows, []]);

    // Send a GET request to the /api/users/:id endpoint
    const response = await supertest(app).get("/api/users/1");

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(rows[0]);
  });

  it("should fail on invalid id", async () => {
    // Mock empty rows returned from the database
    const rows = [] as Rows;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [rows, []]);

    // Send a GET request to the /api/users/:id endpoint with an invalid ID
    const response = await supertest(app).get("/api/users/0");

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });
});

// Test suite for the POST /api/users route
// Doesn't pass: maybe something to change in app config :/
describe("POST /api/users", () => {
  it("should add a new user successfully", async () => {
    // Mock result of the database query
    const result = { insertId: 1 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Fake user data
    // const fakeUser = { firstname: "foo", user_id: 0 };
    const fakeUser = { firstname: "foo" };

    // Send a POST request to the /api/users endpoint with a test user
    const response = await supertest(app).post("/api/users").send(fakeUser);

    // Assertions
    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.insertId).toBe(result.insertId);
  });

  it("should fail on invalid request body", async () => {
    // Mock result of the database query
    const result = { insertId: 1 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Fake user data with missing user_id
    const fakeUser = { firstname: "foo" };

    // Send a POST request to the /api/users endpoint with a test user
    const response = await supertest(app).post("/api/users").send(fakeUser);

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body).toEqual({});
  });
});

// Test suite for the PUT /api/users/:id route
// This route is not yet implemented :/
describe("PUT /api/users/:id", () => {
  it("should update an existing user successfully", async () => {
    // Mock result of the database query
    const result = { affectedRows: 1 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Fake user data
    // const fakeUser = { firstname: "foo", user_id: 0 };
    const fakeUser = { firstname: "foo" };
    // Send a PUT request to the /api/users/:id endpoint with a test user
    const response = await supertest(app).put("/api/users/42").send(fakeUser);

    // Assertions
    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("should fail on invalid request body", async () => {
    // Mock result of the database query
    const result = { affectedRows: 1 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Fake user data with missing user_id
    const fakeUser = { firstname: "foo" };

    // Send a PUT request to the /api/users/:id endpoint with a test user
    const response = await supertest(app).put("/api/users/42").send(fakeUser);

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body).toEqual({});
  });

  it("should fail on invalid id", async () => {
    // Mock result of the database query
    const result = { affectedRows: 0 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Fake user data with missing user_id
    // const fakeUser = { firstname: "foo", user_id: 0 };
    const fakeUser = { firstname: "foo" };
    // Send a PUT request to the /api/users/:id endpoint with a test user
    const response = await supertest(app).put("/api/users/43").send(fakeUser);

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });
});

// Test suite for the DELETE /api/users/:id route
// This route is not yet implemented :/
describe("DELETE /api/users/:id", () => {
  it("should delete an existing user successfully", async () => {
    // Mock result of the database query
    const result = { affectedRows: 1 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Send a DELETE request to the /api/users/:id endpoint
    const response = await supertest(app).delete("/api/users/42");

    // Assertions
    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("should fail on invalid id", async () => {
    // Mock result of the database query
    const result = { affectedRows: 0 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    // Send a DELETE request to the /api/users/:id endpoint
    const response = await supertest(app).delete("/api/users/43");

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });
});
