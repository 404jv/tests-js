import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a user", async () => {
    const user = await createUserUseCase.execute({
      name: "João Victor",
      email: "joaovictorramalho7@gmail.com",
      password: "123"
    });

    expect(user).toHaveProperty("id");
    expect(user.name).toEqual("João Victor");
    expect(user.email).toEqual("joaovictorramalho7@gmail.com");
  });

  it("Should not be able to create a user with the same email", async () => {
    await createUserUseCase.execute({
      name: "test_user1",
      email: "test@gmail.com",
      password: "123"
    });

    expect(async () => {
      await createUserUseCase.execute({
        name: "test_user2",
        email: "test@gmail.com",
        password: "123"
      });
    }).rejects.toEqual(new CreateUserError());
  });
});
