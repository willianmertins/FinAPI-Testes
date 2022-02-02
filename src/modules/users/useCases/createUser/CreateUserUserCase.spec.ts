import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let createUserInMemory: InMemoryUsersRepository;

describe("Create User ", () => {
  beforeEach(async () => {
    createUserInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(createUserInMemory);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
  });

  it("should be able to create a new user if already exists", async () => {
    const user = await createUserUseCase.execute({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    await createUserUseCase.execute(user);

    expect(createUserUseCase.execute(user)).rejects.toBeInstanceOf(
      CreateUserError
    );
  });
});
