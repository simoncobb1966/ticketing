// // app/actions.ts — Server Actions
// "use server";

// import { db } from "@/db/db";
// import { todos } from "@/db/schema";
// import { eq } from "drizzle-orm";
// import { revalidatePath } from "next/cache";

// export async function addTodo(formData: FormData) {
//   const text = formData.get("text") as string;
//   if (!text?.trim()) return;

//   await db.insert(todos).values({
//     text: text.trim(),
//     done: false,
//   });

//   revalidatePath("/");
// }

// export async function toggleTodo(formData: FormData) {
//   const id = parseInt(formData.get("id") as string);

//   // Fetch current state, then flip it
//   const [todo] = await db.select().from(todos).where(eq(todos.id, id));

//   await db.update(todos).set({ done: !todo.done }).where(eq(todos.id, id));

//   revalidatePath("/");
// }

// export async function deleteTodo(formData: FormData) {
//   const id = parseInt(formData.get("id") as string);

//   await db.delete(todos).where(eq(todos.id, id));

//   revalidatePath("/");
// }
