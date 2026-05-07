"use client";
import { StateContext } from "@/components/contexts/stateData/stateContext";
import { useContext } from "react";

export default function useStateData() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateData must be used within a StateContextProvider");
  }
  return context;
}
