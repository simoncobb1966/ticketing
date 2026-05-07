"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogOut, LogIn } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useUserContext from "@/components/contexts/userContext/useUserContext";

export default function NavBar() {
  const { user, setUser } = useUserContext();
  const [page, setPage] = useState("Home");

  const logout = () => {
    setUser(null);
  };
  const buttons = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Add Users",
      href: "/randomUser",
    },
    {
      label: "Admin",
      href: "/admin",
    },
  ];

  let initials = "";
  if (user) {
    initials +=
      user?.firstName.charAt(0).toUpperCase() +
      user?.lastName.charAt(0).toUpperCase();
  }

  const height = 64 / 4;

  return (
    <>
      <div
        className={`h-${height} box-border justify-between flex p-4 border-b-1 border-black fixed top-0 left-0 bg-white w-full`}
      >
        <div className="flex gap-2">
          {buttons.map((link) => {
            return (
              <Link
                onNavigate={() => {
                  setPage(link.label);
                }}
                key={link.href}
                className={`border-2 border-solid px-2 ${page === link.label ? "bg-red-500" : ""}`}
                href={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={logout} className="bg-transparent">
                {user ? <LogOut color="red" /> : <LogIn color="green" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user ? "Log Out" : "Log In"}</p>
            </TooltipContent>
          </Tooltip>

          <Avatar>
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="w-full h-16" />
    </>
  );
}
