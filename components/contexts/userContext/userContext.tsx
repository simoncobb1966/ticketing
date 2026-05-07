"use client";
import { createContext, useCallback, useMemo, useState } from "react";
import { User } from "@/types/User";
import { rolesSeed } from "@/constants/seedData";

interface UserContextProps {
  user: User | null;
  handleSetUser: (newUser: User | null) => void;
}

const testUser: User = {
  id: "046bc5ff-bf66-44b8-bef0-df83c50da918",
  firstName: "Erika",
  lastName: "Charles",
  email: "Erika.Charles@tesburys.co.uk",
  role: rolesSeed[0].id,
  password: "admin",
};

const UserContext = createContext<UserContextProps | null>(null);

const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(testUser);

  const handleSetUser = useCallback(
    (newUser: User | null) => setUser(newUser),
    [],
  );

  const contextValue = useMemo<UserContextProps>(
    () => ({ user, handleSetUser }),
    [user, handleSetUser],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export { UserContextProvider, UserContext };
