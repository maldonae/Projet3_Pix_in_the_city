import dotenv from "dotenv";

dotenv.config({ path: ".env" });

import supertest from "supertest";
import databaseClient from "../database/client";
import app from "../src/app";

describe("users API Endpoints", () => {
  // Test GET /api/users : vérifier la récupération des utilisateurs
  test("GET /api/users doit retourner la liste des utilisateurs", async () => {
    const response = await supertest(app).get("/api/users");

    // Vérification de la réponse
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("firstname");
    expect(response.body[0]).toHaveProperty("lastname");
  });
  describe("photos API Endpoints", () => {
    // Test GET /api/photos : vérifier la récupération des photos
    test("GET /api/photos doit retourner la liste des photos", async () => {
      const response = await supertest(app).get("/api/photos");

      // Vérification de la réponse
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("title");
      expect(response.body[0]).toHaveProperty("picture");
    });
    // Après tous les tests, fermer la connexion à la base
    afterAll(async () => {
      await databaseClient.end();
    });
  });
});
