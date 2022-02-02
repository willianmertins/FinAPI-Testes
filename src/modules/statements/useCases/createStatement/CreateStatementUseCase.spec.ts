import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateStatementError } from "./CreateStatementError";

let createStatementUseCase: CreateStatementUseCase;
let usersRepository: IUsersRepository;
let inMemoryStamentsRepository: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}
describe("Create Statements", () => {
  beforeEach(() => {
    inMemoryStamentsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      inMemoryStamentsRepository
    );
  });

  it("Should be create a statement deposit", async () => {
    const user = await usersRepository.create({
      name: "Test User",
      email: "test@example.com",
      password: "test",
    });

    const response = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 2000,
      description: "deposit",
    });
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("amount");
    expect(response).toHaveProperty("description");
  });

  it("Should not be able statement withdraw when balance is small than amount", async () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: "Test User",
        email: "test@example.com",
        password: "test",
      });

      const response = await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "deposit",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("Should be able statement withdraw", async () => {
    const user = await usersRepository.create({
      name: "Test User",
      email: "test@example.com",
      password: "test",
    });

    const response = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 100,
      description: "withdraw",
    });
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("amount");
    expect(response).toHaveProperty("description");
  });
});
