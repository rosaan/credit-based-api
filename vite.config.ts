import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  test: {
    fileParallelism: false,
    globals: true,
    setupFiles: ["src/tests/setup.ts"],
    env: {
      NODE_ENV: "test",
      DB_AUTH_URL: "postgres://postgres:postgres@localhost:5432",
      DB_URL: "postgres://postgres:postgres@localhost:5432/credit_test",
      TOKEN_SECRET:
        "b891fb72fdf95b60815321f5430a3087e6ec9359ff0e7b030d90827b0b6bd973735e45914c67d20a723c7cdc7935a866712c6fc97df97ed9226da0d8e106c13f",
    },
  },
});
