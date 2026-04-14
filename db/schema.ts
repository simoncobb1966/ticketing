import {
  pgTable,
  uuid,
  pgEnum,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { rolesSeed } from "./seed";

// --- Enums ---
// export const roleEnum = pgEnum("role", [roleType.user, roleType.admin, roleType.guest]);
export const roleEnum = pgEnum("role", ['user', 'admin', 'guest']);

// --- Roles Table ---
export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  role: roleEnum("role").notNull(),
});

// --- Users Table ---
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  role: uuid("role_id")
        .notNull()
        .references(() => roles.id)
        .default(rolesSeed[2].id),
});

// --- Relations ---
export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.role],
    references: [roles.id],
  }),
}));

// TypeScript types inferred from schema
// export type Todo = typeof todos.$inferSelect;
// export type NewTodo = typeof todos.$inferInsert;
// export type User = typeof users.$inferSelect;
// export type NewUser = typeof users.$inferInsert;
// export type Role = typeof roles.$inferSelect;
// export type NewRole = typeof roles.$inferInsert;
export type User = InferSelectModel<typeof users>;
// export type UserWithPassword = InferSelectModel<typeof users>;
// export type User = Omit<UserWithPassword, "password">;
export type Role = InferSelectModel<typeof roles>;
