import { RandomUser } from "@/types/RandomUser";
import { mockDelay } from "@/lib/utils";
import Image from "next/image";
import AddToDatabase from "./addToDatabase";

export default async function Page() {
  const qtyUsers = 10;
  const getData = async () => {
    await mockDelay(1);
    const res = await fetch(`https://randomuser.me/api/?results=${qtyUsers}`);
    const users = await res.json();
    const results: RandomUser[] = users.results;
    return results;
  };

  const randomUsers = await getData();

  return (
    <div className="flex flex-col h-full h-stretch justify-between overflow-hidden">
      <div className="stretch overflow-y-scroll">
        <h1>Random Users Component</h1>
        {randomUsers.map((user) => {
          const { email, name, picture } = user;
          return (
            <div key={email}>
              <h1>
                {name.title} {name.first} {name.last}
              </h1>
              <Image
                src={picture.thumbnail}
                alt={email}
                width={50}
                height={50}
                loading="eager"
              />
            </div>
          );
        })}
      </div>
      <div className="p-4">
        <AddToDatabase users={randomUsers} />
      </div>
    </div>
  );
}
