// app/actions.ts — Server Actions
"use server";

import { db } from "@/db/db";
import { roles, User, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NewUser } from "@/types/newUser";

export async function getAllUsers() {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        createdAt: users.createdAt,
        role: roles.role,
      })
      .from(users)
      .leftJoin(roles, eq(users.role, roles.id));

    return allUsers as User[];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [] as User[];
  }
}

export async function upsertUser(userData: NewUser) {
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
  const res = await db.delete(users).where(eq(users.id, id)).returning({
    id: users.id,
    firstName: users.firstName,
    lastName: users.lastName,
  });

  return res;

  revalidatePath("/");
}
