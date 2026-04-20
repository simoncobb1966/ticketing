import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { Role, roles, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isEmpty } from "lodash";
import { User, KeyOfUser } from "@/types/User";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    const res = await db.delete(users).where(eq(users.id, id)).returning();

    if (isEmpty(res)) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: `${error} Failed to delete user` },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const allRoles: Role[] = await db.select().from(roles);
  const { id } = await params;
  const data = await request.json();

  const patchedUser: Partial<User> = { updatedAt: new Date() };
  const fields: KeyOfUser[] = ["firstName", "lastName", "email", "role"];
  fields.forEach((field: keyof User) => {
    if (data[field] !== undefined) {
      patchedUser[field] = data[field];
    }
  });

  if (
    patchedUser?.role &&
    !allRoles.map((role) => role.id).includes(patchedUser.role)
  ) {
    console.error("Error updating user, role is invalid");
    return "Error updating user, role is invalid";
  }

  try {
    const res = await db.update(users).set(patchedUser).where(eq(users.id, id));

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error updating user:", error);
    return error;
  }
}
