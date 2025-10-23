import { expect, it, beforeAll, afterAll, describe, beforeEach } from "vitest";
import { execSync } from "node:child_process";
import request from "supertest";
import { app } from "../src/app";

describe("Transactions routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex -- migrate:rollback --all");
    execSync("npm run knex -- migrate:latest");
  });

  it("deve criar uma transação com sucesso", async () => {
    await request(app.server)
      .post("/transactions")
      .send({
        text: "Nova transação",
        amount: 5000,
        type: "credit",
      })
      .expect(201);
  });

  it("deve listar todas as transações", async () => {
    const createTransactionsResponse = await request(app.server)
      .post("/transactions")
      .send({
        text: "Nova transação",
        amount: 5000,
        type: "credit",
      });
    const cookies = createTransactionsResponse.get("Set-Cookie");

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        text: "Nova transação",
        amount: 5000,
      }),
    ]);
  });

  it("deve obter uma transação específica", async () => {
    const createTransactionsResponse = await request(app.server)
      .post("/transactions")
      .send({
        text: "Nova transação",
        amount: 5000,
        type: "credit",
      });
    const cookies = createTransactionsResponse.get("Set-Cookie");

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    const transactionId = listTransactionsResponse.body.transactions[0].id;

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        text: "Nova transação",
        amount: 5000,
      })
    );
  });

  it("deve obter o resumo das transações", async () => {
    const createTransactionsResponse = await request(app.server)
      .post("/transactions")
      .send({
        text: "Transação de crédito",
        amount: 5000,
        type: "credit",
      });
    const cookies = createTransactionsResponse.get("Set-Cookie");

    await request(app.server)
      .post("/transactions")
      .set("Cookie", cookies)
      .send({
        text: "Transação de débito",
        amount: 2000,
        type: "debit",
      });

    const summaryResponse = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies)
      .expect(200);

    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    });
  });
});
