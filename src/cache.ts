import { InferSelectModel } from "drizzle-orm";
import NodeCache from "node-cache";
import { user as userSchema } from "./schema";

const cache = new NodeCache();

export const useBalanceCache = (userId: number) => {
  const cacheKey = "user-balance-" + userId;

  const setBalance = (balance: number) => {
    cache.set(cacheKey, balance, 60 * 60);
  };

  const hasBalanceCache = () => {
    return cache.has(cacheKey);
  };

  const getBalance = () => {
    return Number(cache.get(cacheKey));
  };

  const purgeBalance = () => {
    cache.del(cacheKey);
  };

  return {
    setBalance,
    getBalance,
    hasBalanceCache,
    purgeBalance,
  };
};

export const useUserCache = (userId: number) => {
  const cacheKey = "user-" + userId;

  const setUser = (user: InferSelectModel<typeof userSchema>) => {
    cache.set(cacheKey, user, 60 * 60);
  };

  const getUser = () => {
    return cache.get(cacheKey) as InferSelectModel<typeof userSchema>;
  };

  const purgeUser = () => {
    cache.del(cacheKey);
  };

  return {
    setUser,
    getUser,
    purgeUser,
  };
};
