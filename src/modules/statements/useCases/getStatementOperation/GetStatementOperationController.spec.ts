import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Stament Operation", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to list statement by id", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Test",
      email: "teste@example.com",
      password: "password",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "teste@example.com",
      password: "password",
    });

    const { token } = responseToken.body;

    const deposit = await request(app)
      .post("/api/v1/statements/deposit")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        user_id: "1234",
        type: OperationType.DEPOSIT,
        amount: 150,
        description: "deposit",
      });

    const { id } = deposit.body;

    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.body).toHaveProperty("id");
  });
});
