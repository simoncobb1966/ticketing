"use server";

import { db } from "@/db/db";
import { roles, users, Role } from "@/db/schema";
import { eq, ilike, or, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { User } from "@/types/User";
import z from "zod";
import { NextResponse } from "next/server";

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

export type UpsertUserType = Omit<User, "id"> & { id?: string };

export async function insertMultipleUsers(usersData: string) {
  const parsedData: Record<string, UpsertUserType[]> =
    await JSON.parse(usersData);

  const validateUsers = async (users: Record<string, UpsertUserType[]>) => {
    if (users?.newUsers && Array.isArray(users.newUsers)) {
      const allRoles: Role[] = await db.select().from(roles);

      const userValidation = z.object({
        firstName: z.string("Invalid First Name"),
        lastName: z.string("Invalid Lastst Name"),
        email: z.email("Invalid Email address"),
        password: z.string("Invalid Password"),
        role: z.enum(allRoles.map((role: Role) => role.id)),
        id: z.optional(z.uuidv4()),
      });

      users.newUsers.forEach((user) => {
        const validationResult = userValidation.safeParse(user);
        const { success, error } = validationResult;
        if (!success) {
          const prettyError = z.prettifyError(error);
          return NextResponse.json(
            { error: "User Data Validation Error", prettyError },
            { status: 400 },
          );
        }
        return true;
      });
    }
    return NextResponse.json(
      { error: "User Data Validation Error" },
      { status: 400 },
    );
  };

  try {
    validateUsers(parsedData);
    const insertedUsers = await db
      .insert(users)
      .values(parsedData.newUsers)
      .returning();
    return insertedUsers;
  } catch (error) {
    console.error("Error inserting multiple users:", error);
  }
}

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

    revalidatePath("/");
    return user.rowCount;
  } catch (error) {
    console.error("Error upserting user:", error);
    return error;
  }
}

export async function deleteManyUsers(id: string[]) {
  id.forEach((userId) => {
    deleteUser(userId);
  });
}

export async function deleteUser(id: string | string[]) {
  if (typeof id === "string") {
    try {
      const res = await db.delete(users).where(eq(users.id, id)).returning();
      revalidatePath("/");
      return res;
    } catch (error) {
      console.error("Error deleting user:", error);
      return "Failed to delete user";
    }
  } else {
    deleteManyUsers(id);
  }
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
