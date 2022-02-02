import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";

import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get statement operation", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });

  it("should be able to get a statement of an user", async () => {
    const user = await usersRepositoryInMemory.create({
      email: "user@example.com",
      name: "user",
      password: "password",
    });

    const statementCreated = await statementsRepositoryInMemory.create({
      user_id: user.id,
      description: "deposit",
      amount: 1000,
      type: OperationType.DEPOSIT,
    });

    const statement = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statementCreated.id,
    });

    expect(statement).toHaveProperty("id");
    expect(statement.user_id).toEqual(user.id);
  });

  it("should not be able to get a statement of a user that does not exist", async () => {
    expect(
      getStatementOperationUseCase.execute({
        user_id: "fakeUserId",
        statement_id: "fakeStatementId",
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get a statement that does not exist", async () => {
    const user = await usersRepositoryInMemory.create({
      email: "user@example.com",
      name: "user",
      password: "password",
    });

    expect(
      getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "fakeStatementId",
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
