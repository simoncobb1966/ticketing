// app/actions.ts — Server Actions
"use server";

import { db } from "@/db/db";
import { roles, users } from "@/db/schema";
import { eq, ilike, or, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { User } from "@/types/User";

export async function getAllUsers(sortAlphabetically: boolean) {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        updatedAt: users.updatedAt,
        role: roles.role,
      })
      .from(users)
      .leftJoin(roles, eq(users.role, roles.id))
      .orderBy(sortAlphabetically ? asc(users.lastName) : asc(users.updatedAt));

    return allUsers as User[];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [] as User[];
  }
}

type UpsertUserType = Omit<User, "id"> & { id?: string };

export async function upsertUser(userData: UpsertUserType) {
  let user;

  try {
    if (!userData.id) {
      user = await db.insert(users).values(userData);
    } else {
      user = await db
        .update(users)
        .set(userData)
        .where(eq(users.id, userData.id));
    }

    return user.rowCount;
  } catch (error) {
    console.error("Error upserting user:", error);
    return error;
  }

  revalidatePath("/");
}

export async function deleteUser(id: string) {
  try {
    const res = await db.delete(users).where(eq(users.id, id)).returning();
    return res;
  } catch (error) {
    console.error("Error deleting user:", error);
    return "Failed to delete user";
  }
  revalidatePath("/");
}

export async function findAllUsers(search: string) {
  const searchPattern = `%${search}%`;

  try {
    const foundUsers = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        updatedAt: users.updatedAt,
        role: roles.role,
      })
      .from(users)
      .leftJoin(roles, eq(users.role, roles.id))
      .where(
        or(
          ilike(users.firstName, searchPattern),
          ilike(users.lastName, searchPattern),
          ilike(users.email, searchPattern),
        ),
      );

    return foundUsers as User[];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [] as User[];
  }
}
