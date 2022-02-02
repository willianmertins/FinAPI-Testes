import request from "supertest";

import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Authenticate a User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate a user", async () => {
    await request(app).post("/api/v1/users").send({
      email: "user@example.com",
      name: "User name",
      password: "password",
    });

    const { body: responseAuthenticate } = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@example.com",
        password: "password",
      });

    expect(responseAuthenticate).toHaveProperty("user");
    expect(responseAuthenticate).toHaveProperty("token");
    expect(responseAuthenticate.user).toHaveProperty("id");
  });
});
