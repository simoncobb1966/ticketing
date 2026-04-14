"use client";

import { deleteUser, getAllUsers, upsertUser } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import toast from "@/app/components/toast";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllRoles } from "./actions/roles";
import { useEffect, useState } from "react";
import { Role, User } from "@/db/schema";

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const upsertUserHandler = async (userData: FormData) => {
    const id: { id?: string } = {};
    if (selectedUser) {
      id.id = selectedUser.id;
    }

    let user = {
      firstName: userData.get("firstName") as string,
      lastName: userData.get("lastName") as string,
      role: selectedRole as string,
      email: userData.get("email") as string,
      // password: userData.get("password") as string
      password: "admin",
    };

    user = { ...user, ...id };

    const res = await upsertUser(user);
    console.log("res", res);
    if (!res) {
      toast(
        id.id ? "User has not been updated" : "User has not been created",
        "error",
      );
      return;
    } else {
      toast(
        id.id ? "User has been updated" : "User has been created",
        "success",
      );
    }

    await fetchUsers();
    setSelectedUser(null);
    setSelectedRole("");
  };

  const fetchUsers = async () => {
    setUsers(await getAllUsers());
  };

  const fetchRoles = async () => {
    setRoles(await getAllRoles());
  };

  const editHandler = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(roles.find((role) => role.role === user.role)?.id || "");
  };

  const deleteHandler = async (id: string) => {
    const res = await deleteUser(id);
    console.log("delete res", res);
    toast(`${res[0].firstName} ${res[0].lastName} has been deleted`, "success");
    await fetchUsers();
  };

  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      await fetchUsers();
      await fetchRoles();
    };

    fetchUsersAndRoles();
  }, []);

  return (
    // <main className="max-w-lg mx-auto mt-16 px-4">
    <main className=" mx-auto mt-16 px-4">
      <h1 className="text-2xl font-semibold mb-6">CRUD Users</h1>
      <p>TODO</p>
      <p>Find user</p>
      <p>Validate inputs</p>
      <p>Testing, start with delete user</p>
      <p>Sort by date created/updated</p>
      <p>Soft Delete</p>
      <p>Pagination</p>
      <p>Look at db return values</p>

      {/* Users list */}
      <ul className="space-y-2 mb-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center gap-3 p-3 border rounded"
          >
            <div className="flex justify-between w-full">
              <div className="flex">
                {`${user.firstName} ${user.lastName} ${user.role}`}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => editHandler(user)}>Edit</Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteHandler(user.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex gap-2 mb-6 ">
        <form
          action={(data) => upsertUserHandler(data)}
          className="flex items-center gap-2 mb-6"
        >
          <input
            name="firstName"
            placeholder="First name..."
            className="flex-1 border rounded px-3 py-2 text-sm"
            required
            defaultValue={selectedUser ? selectedUser.firstName : ""}
          />
          <input
            name="lastName"
            placeholder="Last name..."
            className="flex-1 border rounded px-3 py-2 text-sm"
            required
            defaultValue={selectedUser ? selectedUser.lastName : ""}
          />
          <input
            name="email"
            placeholder="email..."
            className="flex-1 border rounded px-3 py-2 text-sm"
            required
            defaultValue={selectedUser ? selectedUser.email : ""}
          />
          <Select
            name="role"
            value={selectedRole}
            onValueChange={(value) => setSelectedRole(value)}
          >
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Role</SelectLabel>

                {roles.map((role) => (
                  <SelectItem value={role.id} key={role.id}>
                    {role.role}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button disabled={!selectedRole} variant="outline" type="submit">
            {selectedUser ? "Update" : "Create"}
          </Button>
        </form>
      </div>
    </main>
  );
}
