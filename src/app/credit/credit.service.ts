import { useBalanceCache } from "../../cache";
import { transaction } from "../../schema";
import { db } from "../../db/setup";
import { eq, sql } from "drizzle-orm";

/**
 * Adds a specified amount of credit to a user's balance.
 *
 * @param userId The unique identifier of the user.
 * @param amount The amount of credit to be added.
 * @returns A promise that resolves with a success message.
 * @throws Throws an "Internal Server Error" message if the operation fails.
 */
export const addCreditBalanceByUserId = async (
  userId: number,
  amount: number
): Promise<string> => {
  const { purgeBalance } = useBalanceCache(userId);

  try {
    await db.insert(transaction).values({ amount, userId });
    purgeBalance();
    return "Credit added successfully";
  } catch (error) {
    throw "Internal Server Error";
  }
};

/**
 * Deducts a specified amount of credit from a user's balance.
 *
 * @param userId The unique identifier of the user.
 * @param amount The amount of credit to be deducted.
 * @returns A promise that resolves with a success message if the deduction is successful.
 * @throws Throws an "Insufficient balance" error if the user does not have enough credit.
 * @throws Throws an "Internal Server Error" if the operation fails.
 */
export const deductCreditBalanceByUserId = async (
  userId: number,
  amount: number
): Promise<string> => {
  const { purgeBalance } = useBalanceCache(userId);
  const currentBalance = await getCreditBalanceByUserId(userId);

  if (currentBalance - amount < 0) {
    throw "Insufficient balance";
  }

  try {
    await db.insert(transaction).values({ amount: -amount, userId });
    purgeBalance();
    return "Credit deducted successfully";
  } catch (error) {
    throw "Internal Server Error";
  }
};

/**
 * Retrieves the current credit balance for a specified user.
 *
 * @param userId The unique identifier of the user.
 * @param purge Optional. If true, the cache is purged before retrieving the balance. Defaults to false.
 * @returns A promise that resolves with the current balance of the user.
 */
export const getCreditBalanceByUserId = async (
  userId: number,
  purge: boolean = false
): Promise<number> => {
  const { getBalance, setBalance, hasBalanceCache, purgeBalance } =
    useBalanceCache(userId);

  if (purge) {
    purgeBalance();
  }

  if (hasBalanceCache() && !purge) {
    return getBalance();
  }

  const result = await db
    .select({
      balance: sql<number>`cast(sum(amount) as int)`,
    })
    .from(transaction)
    .where(eq(transaction.userId, userId));

  const balance = result[0]?.balance ?? 0;
  setBalance(balance);

  return balance;
};

/**
 * Refreshes the credit balance for a specified user by purging the cache and retrieving the balance anew.
 *
 * @param userId The unique identifier of the user.
 * @returns A promise that resolves with the refreshed balance of the user.
 */
export const refreshCreditBalanceByUserId = async (
  userId: number
): Promise<number> => {
  return getCreditBalanceByUserId(userId, true);
};
