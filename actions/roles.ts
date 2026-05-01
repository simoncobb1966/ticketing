// app/actions.ts — Server Actions
"use server";

import { db } from "@/db/db";
import { roles, Role } from "@/db/schema";

export async function getAllRoles(): Promise<Role[]> {
  const allRoles = await db.select().from(roles);
  return allRoles;
}
