import { setRole, createUser } from "../app/user/user.service";
import { addCreditBalanceByUserId } from "../app/credit/credit.service";

async function seed() {
  console.log("Seeding database");

  const users = [
    {
      email: "admin@admin.com",
      password: "password",
    },
    {
      email: "user@user.com",
      password: "password",
    },
  ];

  for (const user of users) {
    await createUser(user)
      // @ts-ignore
      .then(async ({ data }) => {
        // @ts-ignore
        await addCreditBalanceByUserId(data.id, 10);
      })
      .catch((error) => {
        console.log("Error from test setup:", error);
      });
    console.log("Created user:", user.email);
  }

  await setRole("admin@admin.com", "admin");
  console.log("Setting roles");
  process.exit(0);
}

seed();
