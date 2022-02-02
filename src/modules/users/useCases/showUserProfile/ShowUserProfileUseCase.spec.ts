import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfile: ShowUserProfileUseCase;
let showUserInMemory: InMemoryUsersRepository;

describe("Show user profile", () => {
  beforeEach(() => {
    showUserInMemory = new InMemoryUsersRepository();
    showUserProfile = new ShowUserProfileUseCase(showUserInMemory);
  });

  it("should be able to list users", async () => {
    const user = {
      name: "Test",
      email: "test@example.com",
      password: "test",
    };

    const userCreated = await showUserInMemory.create(user);

    const response = await showUserProfile.execute(userCreated.id as string);

    expect(response).toBe(userCreated);
  });

  it("should not be able to user non-existents", () => {
    expect(async () => {
      await showUserProfile.execute("invalid user");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
