import { RandomUser } from "@/types/RandomUser";
import { mockDelay } from "@/lib/utils";
import Image from "next/image";
import AddToDatabase from "./addToDatabase";

export default async function Page() {
  const qtyUsers = 5;
  const getData = async () => {
    await mockDelay(1);
    const res = await fetch(`https://randomuser.me/api/?results=${qtyUsers}`);
    const users = await res.json();
    const results: RandomUser[] = users.results;
    return results;
  };

  const randomUsers = await getData();

  return (
    <div className="h-stretch border-4 border-orange-500 mb-5 flex flex-col">
      <h1>Random User!!!</h1>
      <div className="overflow-y-scroll h-stretch border-4 border-blue-500">
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
      <AddToDatabase users={randomUsers} />
    </div>
  );
}
