"use client";

import { Button } from "@/components/ui/button";
import { RandomUser } from "@/types/RandomUser";
import { upsertUser, UpsertUserType } from "@/actions/user";
import { rolesSeed } from "@/constants/seedData";
import toast from "@/components/toast";

type Props = {
  users: RandomUser[];
};

export default function AddToDatabase({ users }: Props) {
  const upsert = async (user: UpsertUserType) => {
    return await upsertUser(user);
  };

  const addToDatabase = () => {
    users.forEach((user) => {
      const newUser = {
        firstName: user.name.first,
        lastName: user.name.last,
        email: `${user.name.first}.${user.name.last}@test.com`,
        role: rolesSeed[0].id,
        password: "admin",
      };
      const res = upsert(newUser);
      if (!res) {
        toast("User has been created", "success");
      } else {
        toast("User has not been created", "error");
      }
    });
  };

  return <Button onClick={addToDatabase}>Add To Database</Button>;
}
