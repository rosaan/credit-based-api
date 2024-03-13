import { db } from "../../db/setup";
import { userLoginSchema, userRegistrationSchema } from "./zod/schema";
import argon2 from "argon2";
import { z } from "zod";
import { user } from "../../schema";
import jwt from "jsonwebtoken";
import { useUserCache } from "../../cache";
import { eq } from "drizzle-orm";

/**
 * Creates a new user in the database.
 *
 * @param data The user registration data, validated against the userRegistrationSchema.
 * @returns An object containing a success message and the inserted data.
 * @throws Throws an error if the user already exists or if an internal server error occurs.
 */
export async function createUser(data: z.infer<typeof userRegistrationSchema>) {
  try {
    const encryptedPassword = await argon2.hash(data.password);
    const result = await db.insert(user).values({
      email: data.email,
      password: encryptedPassword,
    });
    return { message: "User registered successfully", data: result };
  } catch (error: any) {
    if (error.code === "23505") {
      throw "User already exists";
    }
    throw "Internal Server Error";
  }
}

/**
 * Generates a JWT token for a user based on email and password.
 *
 * @param data The user login data, validated against the userLoginSchema.
 * @returns An object containing the JWT token.
 * @throws Throws an error if the email or password is incorrect, or if an internal server error occurs.
 */
export async function getUserToken(data: z.infer<typeof userLoginSchema>) {
  const currentUser = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, data.email),
  });

  if (!currentUser) {
    throw "Email or password is incorrect";
  }

  const isValidPassword = await argon2.verify(
    currentUser.password,
    data.password
  );
  if (!isValidPassword) {
    throw "Email or password is incorrect";
  }

  const token = jwt.sign(
    { id: currentUser.id },
    process.env.TOKEN_SECRET as string,
    {
      expiresIn: "1h",
    }
  );
  return { token };
}

/**
 * Retrieves a user by their ID, optionally using a caching mechanism.
 *
 * @param id The ID of the user to retrieve.
 * @returns The user object if found.
 * @throws Throws an error if the user is not found.
 */
export async function getUserById(id: number) {
  const { getUser, setUser } = useUserCache(id);

  let currentUser: any = getUser();

  if (!currentUser) {
    currentUser = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    });

    if (!currentUser) {
      throw "User not found";
    }
    setUser(currentUser);
  }
  return currentUser;
}

/**
 * Updates the role of a user identified by email.
 *
 * @param email The email of the user whose role is to be updated.
 * @param role The new role to assign to the user, either 'admin' or 'user'.
 * @returns The result of the update operation.
 */
export async function setRole(email: string, role: "admin" | "user") {
  return await db.update(user).set({ role }).where(eq(user.email, email));
}
