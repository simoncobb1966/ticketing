"use client";

import { Button } from "@/components/ui/button";
import { RandomUser } from "@/types/RandomUser";
import { UpsertUserType, insertMultipleUsers } from "@/actions/user";
import { rolesSeed } from "@/constants/seedData";
import toast from "@/components/toast";

type Props = {
  users: RandomUser[];
};

export default function AddToDatabase({ users }: Props) {
  const insertUsers = async (newUsers: UpsertUserType[]) => {
    const usersToInsertJson = JSON.stringify({ newUsers: newUsers });
    return await insertMultipleUsers(usersToInsertJson);
  };

  const addToDatabase = async () => {
    const usersToInsert: UpsertUserType[] = users.map((user) => ({
      firstName: user.name.first,
      lastName: user.name.last,
      email: `${user.name.first}.${user.name.last}@test.com`,
      role: rolesSeed[0].id,
      password: "admin",
    }));

    const res = await insertUsers(usersToInsert);
    if (!!res) {
      toast(`${res.length} Users have been created`, "success");
    } else {
      toast("Users have not been created", "error");
    }
  };

  return <Button onClick={addToDatabase}>Add To Database</Button>;
}
