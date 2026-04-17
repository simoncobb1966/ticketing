// db/seed.ts — run with: npm run db:seed
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { roles, users, Role } from "./schema";
import { v4 as uuid } from "uuid";
import "dotenv/config"; // loads .env.local outside Next.js
import { User } from "@/types/User";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export const rolesSeed: Role[] = [
  { role: "admin", id: uuid() },
  { role: "user", id: uuid() },
  { role: "guest", id: uuid() },
];

const usersSeed: User[] = [
  {
    id: uuid(),
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@example.com",
    role: rolesSeed[0].id,
    password: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob@example.com",
    role: rolesSeed[1].id,
    password: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    firstName: "Simon",
    lastName: "Cobb",
    email: "admin@admin.com",
    password: "admin",
    role: rolesSeed[2].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// const seedData = {

// todos: [
//   { text: "Set up Neon database and copy connection string", done: true },

//   { text: "Configure Drizzle schema and run db:push", done: true },

//   { text: "Wire up server actions in Next.js", done: false },

//   { text: "Add optimistic UI updates with useOptimistic", done: false },

//   { text: "Deploy to Vercel and test edge runtime", done: false },
// ],
// };

// async function main() {
const main = async () => {
  console.log("🌱 Seeding todos...");

  // Wipe existing rows so seed is idempotent
  // await db.delete(todos);
  // const insertedTodos = await db
  //   .insert(todos)
  //   .values(seedData.todos)
  //   .returning();
  // console.log(`✅ Inserted ${insertedTodos.length} todos`);

  await db.delete(users);

  await db.delete(roles);

  const insertedRoles = await db.insert(roles).values(rolesSeed).returning();
  console.log(`✅ Inserted ${insertedRoles.length} roles`);
  // process.exit(0);

  const insertedUsers = await db.insert(users).values(usersSeed).returning();
  console.log(`✅ Inserted ${insertedUsers.length} users`);
  process.exit(0);
};

// main().catch((err) => {
//   console.error("❌ Seed failed:", err);
//   process.exit(1);
// });

try {
  main();
} catch (err) {
  console.error("❌ Seed failed:", err);
  process.exit(1);
}
