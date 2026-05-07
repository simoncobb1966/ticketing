"use client";

import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import { login } from "@/actions/login";
import { useEffect, useState } from "react";
import useUserContext from "@/components/contexts/userContext/useUserContext";
import UserModal from "@/components/userModal/userModal";
import z from "zod";
import toast from "@/components/toast";
import { Role } from "@/db/schema";
import { getAllRoles } from "@/actions/roles";
import { upsertUser } from "@/actions/user";

export const DOMAIN = "test.com";
export const PASSWORD = "admin";

export default function HomePage() {
  const { user, setUser } = useUserContext();
  const [logInError, setLogInError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [roles, setRoles] = useState<Role[]>([]);

  const loginHandler = async (data: FormData) => {
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    const res = await login(email.trim(), password);
    if (res) {
      setUser({ ...res, role: res.role || "user" });
      setLogInError(null);
    } else {
      setLogInError("Invalid email or password");
    }
  };

  const addNewUserHandler = async (userData: FormData) => {
    const firstName = userData.get("firstName") as string;
    const lastName = userData.get("lastName") as string;

    const user = {
      firstName,
      lastName,
      email: `${firstName}.${lastName}@${DOMAIN}`,
      password: PASSWORD,
      role: selectedRole as string,
      // email: userData.get("email") as string,
      // password: userData.get("password") as string,
    };

    // user = { ...user, ...id };

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
        toast(`User has not been created ${res}`, "error");
        return;
      } else {
        toast("User has been created", "success");
      }

      setSelectedRole("");
    }
  };

  const fetchRoles = async () => {
    setRoles(await getAllRoles());
  };

  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      await fetchRoles();
    };

    fetchUsersAndRoles();
  }, []);

  return (
    <main className="px-4 overflow-y-auto w-full">
      <h1 className="text-2xl font-semibold mb-6">CRUD Users</h1>
      <p>TODO</p>
      <p>
        LOOK AT B/E and ensure the data is returned in an object with data:
        data, error: error
      </p>
      <p>VITEST - remove JEST stuff first</p>
      <p>Look at Front End Masters project to see what tanstack does</p>
      <p>Testing, start with delete user</p>
      <p>Create AWS Lambda functions for the b/e</p>
      <p>Soft Delete</p>
      <p>Pagination</p>
      <p>Add a department table and add a dept field to User</p>
      <p>Look at db return values</p>
      <p>Skeleton</p>
      <p>Uplaod an avatar to an S3 bucket via a Lambda function</p>
      {/* <img
        src="https://lambdasam-a4dde144fc-eu-west-2.s3.eu-west-2.amazonaws.com/simon_cobb.jpeg"
        alt="simon_cobb"
        width={80}
        height={50}
      /> */}

      {!user && (
        <form
          className="flex flex-col gap-2 items-center my-2"
          action={loginHandler}
        >
          <input
            name="email"
            placeholder="email ..."
            className="flex-1 border rounded px-3 py-2 text-sm"
            required
            defaultValue={""}
          />

          <input
            name="password"
            placeholder="password ..."
            className="flex-1 border rounded px-3 py-2 text-sm"
            required
            defaultValue={""}
          />

          {logInError && <p className="text-red-500">{logInError}</p>}

          <Button variant="outline" type="submit">
            <LogIn />
            {"Log In"}
          </Button>

          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
            <UserPlus />
            {"Add New User"}
          </Button>
        </form>
      )}
      {isModalOpen && (
        <UserModal
          open
          close={() => {
            setIsModalOpen(false);
          }}
          title={"Add User"}
          upsertUserHandler={addNewUserHandler}
          selectedUser={null}
          roles={roles}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
        />
      )}
    </main>
  );
}
