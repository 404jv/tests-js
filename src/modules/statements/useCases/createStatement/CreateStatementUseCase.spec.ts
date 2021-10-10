import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to create a statement", async () => {
    const passwordHash = await hash("123", 8);

    const user = await inMemoryUsersRepository.create({
      name: "João Victor",
      email: "joao@test.com",
      password: passwordHash,
    });


    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 150,
      description: "Test",
      type: OperationType.DEPOSIT
    });

    expect(statement).toHaveProperty("id");
    expect(statement).toHaveProperty("user_id");
    expect(statement.type).toEqual("deposit");
    expect(statement.amount).toEqual(150);
    expect(statement.description).toEqual("Test");
  });

  it("Should not be able to create a statement by a nonexistent user.", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "nonexistent_id",
        amount: 150,
        description: "Test",
        type: OperationType.DEPOSIT
      });
    }).rejects.toEqual(new CreateStatementError.UserNotFound());
  });

  it("Should not be able to withdraw Insufficient funds", async () => {
    const passwordHash = await hash("123", 8);

    const user = await inMemoryUsersRepository.create({
      name: "João Victor",
      email: "joao@test.com",
      password: passwordHash,
    });

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id as string,
        amount: 150,
        description: "Test",
        type: OperationType.WITHDRAW
      });
    }).rejects.toEqual(new CreateStatementError.InsufficientFunds());
  });
});
