"use client";

import {
  deleteUser,
  findAllUsers,
  getAllUsers,
  upsertUser,
} from "@/actions/user";
import { Button } from "@/components/ui/button";
import toast from "@/components/toast";
import { getAllRoles } from "@/actions/roles";
import { useEffect, useState } from "react";
import { Role } from "@/db/schema";
import UserModal from "@/components/userModal/userModal";
import * as z from "zod";
import { User } from "@/types/User";
import { CircleX, RefreshCwOff } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import Image from "next/image";

export const DOMAIN = "test.com";
export const PASSWORD = "admin";

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [searchString, setSearchString] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortAlphabetically, setSortAlphabetically] = useState(true);

  console.log("users", users);

  const upsertUserHandler = async (userData: FormData) => {
    const id: { id?: string } = {};
    if (selectedUser) {
      id.id = selectedUser.id;
    }

    const firstName = userData.get("firstName") as string;
    const lastName = userData.get("lastName") as string;

    let user = {
      firstName,
      lastName,
      email: `${firstName}.${lastName}@${DOMAIN}`,
      password: PASSWORD,
      role: selectedRole as string,
      // email: userData.get("email") as string,
      // password: userData.get("password") as string,
    };

    user = { ...user, ...id };

    const userValidation = z.object({
      firstName: z.string("Invalid First Name"),
      lastName: z.string("Invalid Lastst Name"),
      email: z.email("Invalid Email address"),
      password: z.string("Invalid Password"),
      role: z.union(roles.map((role) => z.string(role.role))),
      id: z.optional(z.uuidv4()),
    });

    const result = userValidation.safeParse(user);
    const { success, error } = result;
    if (!success) {
      const prettyError = z.prettifyError(error);
      toast(prettyError, "error");
    } else {
      const res = await upsertUser(JSON.stringify(user));
      if (typeof res !== "number" || res !== 1) {
        toast(
          id.id
            ? `User has not been updated ${res}`
            : `User has not been created ${res}`,
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
    }
  };

  const fetchUsers = async () => {
    setUsers(await getAllUsers(sortAlphabetically));
  };

  const fetchRoles = async () => {
    setRoles(await getAllRoles());
  };

  const editHandler = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(roles.find((role) => role.role === user.role)?.id || "");
    setIsModalOpen(true);
  };

  const deleteHandler = async (id: string[]) => {
    const res = await deleteUser(JSON.stringify(id));
    console.log("res", res);
    if (Array.isArray(res)) {
      const deletedUser = res[0];
      toast(
        `${deletedUser.firstName} ${deletedUser.lastName} has been deleted`,
        "success",
      );
    }
    await fetchUsers();
  };

  const deleteAllUsers = () => {
    const idsToDelete = users.map((user) => user.id);
    deleteHandler(idsToDelete);
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
    <main className="px-4 overflow-y-auto w-full">
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

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={fetchUsers}>
              <RefreshCwOff />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Refresh</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={deleteAllUsers}>
              <CircleX />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete All</p>
          </TooltipContent>
        </Tooltip>
      </form>
      {searchString && (
        <p className="my-2">{`Search results for "${searchString}"`}</p>
      )}

      <div className="mb-2 flex justify-between">
        <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
          Add User
        </Button>
        <Button
          variant="secondary"
          onClick={async () => {
            setUsers(await getAllUsers(!sortAlphabetically));
            setSortAlphabetically((prev) => !prev);
          }}
        >
          {sortAlphabetically ? "Sort By Created/Updated" : "Sort by Name"}
        </Button>
      </div>

      {/* Users list */}
      <ul className="space-y-2 mb-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center gap-3 p-3 border rounded"
          >
            <div className="flex justify-between w-full">
              <div className="flex">
                {/* {`${user.id} ${user.firstName} ${user.lastName} ${user.role} ${user.updatedAt}`} */}
                {`${user.firstName} ${user.lastName} ${user.email} ${user.password}`}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => editHandler(user)}>Edit</Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteHandler([user.id])}
                >
                  Delete
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <UserModal
          open
          close={() => {
            setSelectedUser(null);
            setIsModalOpen(false);
          }}
          title={selectedUser ? "Edit User" : "Add User"}
          upsertUserHandler={upsertUserHandler}
          selectedUser={selectedUser}
          roles={roles}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
        />
      )}
    </main>
  );
}
