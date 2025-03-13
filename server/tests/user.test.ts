import { afterAll, describe, expect, test } from "@jest/globals";
import app from "../src/app";
import "dotenv/config";
import supertest from "supertest";
import databaseClient from "../database/client";
import type { Result, Rows } from "../database/client";
import userRepository from "../src/modules/user/userRepository";

// Suite de tests pour l'endpoint userAction
describe("User Action Endpoints", () => {
  test("GET /userAction renvoie des utilisateurs", async () => {
    const rows = [{}] as Rows;
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [rows, []]);
    const response = await supertest(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });
  // Test pour ajouter un utilisateur
  test("POST /userAction ajoute un nouvel utilisateur", async () => {
    const newUser = {
      firstname: "John",
      lastname: "Doe",
    };
    jest.spyOn(userRepository, "create").mockResolvedValueOnce(1);
    const response = await supertest(app)
      .post("/api/users")
      .send(newUser)
      .set("Content-Type", "application/json");
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ insertId: 1 });
  });
});
