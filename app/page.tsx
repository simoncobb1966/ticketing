"use client";

import {
  deleteUser,
  findAllUsers,
  getAllUsers,
  upsertUser,
} from "@/app/actions/user";
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
import { UserModal } from "./components/userModal";

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [searchString, setSearchString] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const searchHandler = async (data: FormData) => {
    const search = data.get("search") as string;
    setSearchString(search);
    const foundUsers = await findAllUsers(search);
    setUsers(foundUsers);
  };

  const reset = () => {
    setSearchString("");
    setSelectedUser(null);
    setSelectedRole("");
    fetchUsers();
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
      <p>Validate inputs</p>
      <p>Testing, start with delete user</p>
      <p>Sort by date created/updated</p>
      <p>Soft Delete</p>
      <p>Pagination</p>
      <p>Look at db return values</p>
      <p>Skeleton</p>

      <form className="flex gap-2 items-center my-2" action={searchHandler}>
        <input
          name="search"
          placeholder="search ..."
          className="flex-1 border rounded px-3 py-2 text-sm"
          required
          defaultValue={""}
        />
        <Button variant="outline" type="submit">
          {"Search"}
        </Button>
        <Button variant="outline" type="button" onClick={reset}>
          {"Reset"}
        </Button>
      </form>
      {searchString && (
        <p className="my-2">{`Search results for "${searchString}"`}</p>
      )}

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

      <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
        Add User
      </Button>

      <UserModal
        open={isModalOpen}
        close={() => setIsModalOpen(false)}
        title={selectedUser ? "Edit User" : "Add User"}
        upsertUserHandler={upsertUserHandler}
        selectedUser={selectedUser}
        roles={roles}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      />
    </main>
  );
}
