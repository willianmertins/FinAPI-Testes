import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Create User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create an user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Test",
      email: "test@test.com",
      password: "admin",
    });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a existent user", async () => {
    const user = await request(app).post("/api/v1/users").send({
      name: "Test",
      email: "test@test.com",
      password: "admin",
    });

    expect(user.status).toBe(400);
  });
});
