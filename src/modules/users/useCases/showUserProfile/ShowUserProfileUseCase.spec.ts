import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User's Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("Should be able to list user's data.", async () => {
    const passwordHash = await hash("123", 8);

    const user = await inMemoryUsersRepository.create({
      name: "João Victor",
      email: "joao@test.com",
      password: passwordHash
    });

    const userInfo = await showUserProfileUseCase.execute(user.id as string);

    expect(userInfo).toHaveProperty("id");
    expect(userInfo.name).toEqual("João Victor");
    expect(userInfo.email).toEqual("joao@test.com");
  });

  it("Should not be able to list a nonexistent user.", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("nonexistentId");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
