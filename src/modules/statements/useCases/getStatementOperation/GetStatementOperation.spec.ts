import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get Statement Operation.", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to an user get their statement", async () => {
    const passwordHash = await hash("123", 8);

    const user = await inMemoryUsersRepository.create({
      name: "João Victor",
      email: "joao@gmail.com",
      password: passwordHash
    });

    const statement = await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      amount: 150,
      description: "Test",
      type: OperationType.DEPOSIT
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation).toHaveProperty("user_id");
    expect(statementOperation.amount).toEqual(150);
    expect(statementOperation.description).toEqual("Test");
    expect(statementOperation.type).toEqual("deposit");
  });

  it("Should be able to a nonexistent user get their statement.", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "nonexistentId",
        statement_id: "statement_id"
      });
    }).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });

  it("Should be able to an user get a nonexistent statement.", async () => {
    const passwordHash = await hash("123", 8);

    const user = await inMemoryUsersRepository.create({
      name: "João Victor",
      email: "joao@gmail.com",
      password: passwordHash
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "nonexistentId"
      });
    }).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });
});
