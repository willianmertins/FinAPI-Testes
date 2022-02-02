import { hash } from "bcryptjs";

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Authenticate user", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
  });

  it("should be able to authorization an user", async () => {
    const password = await hash("123456", 8);

    const user = {
      email: "test@test.com",
      name: "test",
      password,
    };

    await usersRepositoryInMemory.create(user);

    const authInfo = await authenticateUserUseCase.execute({
      email: "test@test.com",
      password: "123456",
    });

    expect(authInfo).toHaveProperty("user");
    expect(authInfo).toHaveProperty("token");
  });

  it("should not be able to authorization an user with incorrect email", async () => {
    const password = await hash("123456", 8);

    const user = {
      email: "test@test.com",
      name: "test",
      password,
    };

    await usersRepositoryInMemory.create(user);

    expect(
      authenticateUserUseCase.execute({
        email: "fakeEmail",
        password,
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authorization an user with incorrect password", async () => {
    const password = await hash("123456", 8);

    const user = {
      email: "test@test.com",
      name: "user",
      password,
    };

    await usersRepositoryInMemory.create(user);

    expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "fakePassword",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
