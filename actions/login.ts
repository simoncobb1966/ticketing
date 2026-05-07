"use server";

import { db } from "@/db/db";
import { roles, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { User } from "@/types/User";

export async function login(email: string, password: string) {
  try {
    const user = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        updatedAt: users.updatedAt,
        role: roles.role,
        password: users.password,
      })
      .from(users)
      .leftJoin(roles, eq(users.role, roles.id))
      .where(and(eq(users.email, email), eq(users.password, password)));

    return user.length === 1 ? user[0] : false;
  } catch (error) {
    console.error("Error fetching users:", error);
    return false;
  }
}
