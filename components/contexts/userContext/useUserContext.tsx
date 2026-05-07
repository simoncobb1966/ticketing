"use client";
import { UserContext } from "./userContext";
import { useContext } from "react";

export default function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserContextProvider");
  }
  return context;
}
