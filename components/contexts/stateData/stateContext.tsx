"use client";
import { createContext, useCallback, useMemo, useState } from "react";

interface StateContextProps {
  open: boolean;
  handleSetOpen: VoidFunction;
}

const StateContext = createContext<StateContextProps | null>(null);

const StateContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleSetOpen = useCallback(() => setOpen((prev) => !prev), []);

  const contextValue = useMemo<StateContextProps>(
    () => ({ open, handleSetOpen }),
    [open, handleSetOpen],
  );

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};

export { StateContextProvider, StateContext };
