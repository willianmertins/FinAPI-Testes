import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

let connection: Connection;

describe("Get Balance", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get balance of an user", async () => {
    const user = {
      name: "Test",
      email: "test@example.com",
      password: "password",
    };

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

    await request(app)
      .post("/api/v1/statements/deposit")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        user_id: "1234",
        type: OperationType.DEPOSIT,
        description: "month deposit",
        amount: 100,
      });

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
      });
    expect(response.body.balance).toBe(100);
  });
});
