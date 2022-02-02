import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../../entities/Statement";

import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

describe("Get balance", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory
    );
  });

  it("should be able to get balance of an user", async () => {
    const user = await usersRepositoryInMemory.create({
      email: "user@example.com",
      name: "user",
      password: "password",
    });

    await statementsRepositoryInMemory.create({
      user_id: user.id as string,
      description: "month deposit",
      amount: 1000,
      type: OperationType.DEPOSIT,
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(balance.statement.length).toEqual(2);
    expect(balance.balance).toEqual(500);
  });

  it("should not be able to get balance of an user that does not exist", async () => {
    expect(
      getBalanceUseCase.execute({
        user_id: "fakeUserId",
      })
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
});
