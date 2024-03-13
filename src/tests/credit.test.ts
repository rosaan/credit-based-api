import app from "..";
import { describe, expect, test } from "vitest";
import request from "supertest";

describe("Credit", () => {
  test("should not deduct credit from user account if balance is 0", async () => {
    const response = await request(app)
      .post("/api/credit/run-credit")
      .set("content-type", "application/json")
      // @ts-ignore
      .set("Authorization", `Bearer ${global.userToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Insufficient balance");
  });

  test("should run and deduct a credit from the balance", async () => {
    await request(app)
      .post("/api/credit/add-credit")
      .set("content-type", "application/json")
      // @ts-ignore
      .set("Authorization", `Bearer ${global.adminToken}`)
      .send({
        userId: 2,
        amount: 1,
      });

    await request(app)
      .post("/api/credit/run-credit")
      .set("content-type", "application/json")
      // @ts-ignore
      .set("Authorization", `Bearer ${global.userToken}`);

    const response = await request(app)
      .post("/api/credit/credit-balance")
      .set("content-type", "application/json")
      // @ts-ignore
      .set("Authorization", `Bearer ${global.userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("balance");
    expect(response.body.balance).toBe(0);
  });

  test("should add credit to user account as admin", async () => {
    const response = await request(app)
      .post("/api/credit/add-credit")
      .set("content-type", "application/json")
      // @ts-ignore
      .set("Authorization", `Bearer ${global.adminToken}`)
      .send({
        userId: 2,
        amount: 100,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Credit added successfully");
  });

  test("should not add credit to user account as user", async () => {
    const response = await request(app)
      .post("/api/credit/add-credit")
      .set("content-type", "application/json")
      // @ts-ignore
      .set("Authorization", `Bearer ${global.userToken}`)
      .send({
        userId: 2,
        amount: 100,
      });

    expect(response.status).toBe(403);
  });

  test("should refresh user credit", async () => {
    const response = await request(app)
      .post("/api/credit/refresh-credit")
      .set("content-type", "application/json")
      // @ts-ignore
      .set("Authorization", `Bearer ${global.userToken}`)
      .send({
        userId: 2,
        amount: 100,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("balance");
    expect(response.body.balance).toBe(100);
  });

  test("should not add negative amount credit to user account", async () => {
    const response = await request(app)
      .post("/api/credit/add-credit")
      .set("content-type", "application/json")
      // @ts-ignore
      .set("Authorization", `Bearer ${global.adminToken}`)
      .send({
        userId: 2,
        amount: -100,
      });

    expect(response.status).toBe(400);
  });

  test("should not add anything other than number to credit user account", async () => {
    const response = await request(app)
      .post("/api/credit/add-credit")
      .set("content-type", "application/json")
      // @ts-ignore
      .set("Authorization", `Bearer ${global.adminToken}`)
      .send({
        userId: 2,
        amount: "thisisastring",
      });

    expect(response.status).toBe(400);
  });

  test("should get user credit balance", async () => {
    const response = await request(app)
      .post("/api/credit/credit-balance")
      .set("content-type", "application/json")
      // @ts-ignore
      .set("Authorization", `Bearer ${global.userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("balance");
    expect(response.body.balance).toBe(100);
  });

  test("should not get user credit balance with invalid bearer token", async () => {
    const response = await request(app)
      .post("/api/credit/credit-balance")
      .set("content-type", "application/json")
      // @ts-ignore
      .set("Authorization", `Bearer invalidtoken`);

    expect(response.status).toBe(401);
  });

  test("should deduct credit from user account", async () => {
    const response = await request(app)
      .post("/api/credit/run-credit")
      .set("content-type", "application/json")
      // @ts-ignore
      .set("Authorization", `Bearer ${global.userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Credit deducted successfully");
  });

  test("should have 90 user credit balance", async () => {
    for (let i = 0; i < 9; i++) {
      await request(app)
        .post("/api/credit/run-credit")
        .set("content-type", "application/json")
        // @ts-ignore
        .set("Authorization", `Bearer ${global.userToken}`);
    }

    const response = await request(app)
      .post("/api/credit/credit-balance")
      .set("content-type", "application/json")
      // @ts-ignore
      .set("Authorization", `Bearer ${global.userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("balance");
    expect(response.body.balance).toBe(90);
  });
});
