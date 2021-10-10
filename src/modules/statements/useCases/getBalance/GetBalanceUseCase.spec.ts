import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository,
    );
  });

  it("Should be able to get a user get their balance", async () => {
    const passwordHash = await hash("123", 8);

    const user = await inMemoryUsersRepository.create({
      name: "João Victor",
      email: "joao@gmail",
      password: passwordHash
    });

    await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      amount: 150,
      description: "Test",
      type: OperationType.DEPOSIT
    });

    const balance = await getBalanceUseCase.execute({ user_id: user.id as string });

    expect(balance.statement.length).toEqual(1);
    expect(balance.statement[0]).toHaveProperty("id");
    expect(balance.statement[0]).toHaveProperty("user_id");
    expect(balance.statement[0].amount).toEqual(150);
    expect(balance.statement[0].description).toEqual("Test");
    expect(balance.statement[0].type).toEqual("deposit");
    expect(balance.balance).toEqual(150);
  });

  it("Should not be able to a nonexistent user get their balance.", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "nonexistentUser" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
