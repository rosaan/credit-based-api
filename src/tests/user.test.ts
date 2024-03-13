import app from "..";
import { describe, expect, test } from "vitest";
import request from "supertest";

describe("User", () => {
  test("should register a user", async () => {
    const response = await request(app)
      .post("/api/user/register")
      .set("content-type", "application/json")
      .send({
        email: "rosaan+1@rosaan.com",
        password: "password",
      });

    expect(response.status).toBe(200);
  });

  test("should login a user", async () => {
    const response = await request(app)
      .post("/api/user/login")
      .set("content-type", "application/json")
      .send({
        email: "rosaan@rosaan.com",
        password: "password",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  test("should not login a user with incorrect password", async () => {
    const response = await request(app)
      .post("/api/user/login")
      .set("content-type", "application/json")
      .send({
        email: "rosaan@rosaan.com",
        password: "drowssap",
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Email or password is incorrect");
  });

  test("should return the user's email", async () => {
    const response = await request(app)
      .post("/api/user/me")
      .set("content-type", "application/json")
      // @ts-ignore
      .set("Authorization", `Bearer ${global.userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("email");
    expect(response.body.email).toBe("rosaan@rosaan.com");
  });

  test("should not return the user's email with bearer wrong token", async () => {
    const response = await request(app)
      .post("/api/user/me")
      .set("content-type", "application/json")
      // @ts-ignore
      .set("Authorization", `Bearer invalidtoken`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Unauthorized");
  });

  test("should not return the user's email with no bearer token", async () => {
    const response = await request(app)
      .post("/api/user/me")
      .set("content-type", "application/json");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Unauthorized");
  });
});
