"use client";
import { createContext, useCallback, useMemo, useState } from "react";
import { User } from "@/types/User";
import { rolesSeed } from "@/constants/seedData";

interface UserContextProps {
  user: User | null;
  setUser: (newUser: User | null) => void;
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
  const [user, setUserContext] = useState<User | null>(testUser);

  const setUser = useCallback(
    (newUser: User | null) => setUserContext(newUser),
    [],
  );

  const contextValue = useMemo<UserContextProps>(
    () => ({ user, setUser }),
    [user, setUser],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export { UserContextProvider, UserContext };
