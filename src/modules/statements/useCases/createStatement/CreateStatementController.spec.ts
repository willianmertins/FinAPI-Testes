import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  const user = {
    name: "Test",
    email: "test@example.com",
    password: "password",
  };

  it("Should be create a new deposit", async () => {
    await request(app).post("/api/v1/users").send({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password,
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .set({
        Authorization: ` Bearer ${token}`,
      })
      .send({
        user_id: "1223",
        type: OperationType.DEPOSIT,
        amount: 200,
        description: "Test",
      });

    expect(response.statusCode).toBe(201);
  });

  it("Should be able to create withdraw", async () => {
    await request(app).post("/api/v1/users").send({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password,
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .set({
        Authorization: ` Bearer ${token}`,
      })
      .send({
        user_id: "1223",
        type: OperationType.DEPOSIT,
        amount: 50,
        description: "withdraw test",
      });

    expect(response.statusCode).toBe(201);
  });
});
