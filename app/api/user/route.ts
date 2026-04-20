import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { users, roles, Role } from "@/db/schema";
import { eq } from "drizzle-orm";
import z from "zod";

export async function GET() {
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
      .leftJoin(roles, eq(users.role, roles.id));
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("Error fetching issues:", error);
  }
}

export async function POST(request: Request) {
  const allRoles: Role[] = await db.select().from(roles);

  try {
    const data = await request.json();

    const userValidation = z.object({
      firstName: z.string("Invalid First Name"),
      lastName: z.string("Invalid Lastst Name"),
      email: z.email("Invalid Email address"),
      password: z.string("Invalid Password"),
      role: z.enum(allRoles.map((role: Role) => role.id)),
      id: z.optional(z.uuidv4()),
    });

    const result = userValidation.safeParse(data);
    const { success, error } = result;
    if (!success) {
      const prettyError = z.prettifyError(error);
      return NextResponse.json(
        { error: "User Data Validation Error", prettyError },
        { status: 400 },
      );
    }
    const newUser = await db
      .insert(users)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
      })
      .returning();

    return NextResponse.json(
      { message: "User created successfully", user: newUser[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
