import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);

  });

  it("Should be able to authenticate an user", async () => {
    const passwordHash = await hash("123", 8);

    inMemoryUsersRepository.create({
      name: "test",
      email: "test@test.com",
      password: passwordHash
    });

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: "test@test.com",
      password: "123"
    });

    expect(userAuthenticated).toHaveProperty("token");
    expect(userAuthenticated.user).toHaveProperty("id");
    expect(userAuthenticated.user.name).toEqual("test");
    expect(userAuthenticated.user.email).toEqual("test@test.com");
  });

  it("Should not be able to authenticate a nonexistent user", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "nonexistentemail@test.com",
        password: "nonexistentPassword"
      });
    }).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("Should not be able to authenticate with incorrect credentials", async () => {
    const passwordHash = await hash("123", 8);

    const user = await inMemoryUsersRepository.create({
      name: "test",
      email: "test@test.com",
      password: passwordHash
    });

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrectPassword"
      });
    }).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });
});
