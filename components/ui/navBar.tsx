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
import { usePathname } from "next/navigation";

export default function NavBar() {
  const [page, setPage] = useState<null | string>(null);
  const pathname = usePathname();
  const { user, setUser } = useUserContext();

  if (!page) {
    setPage(pathname);
  }

  const logout = () => {
    setUser(null);
  };

  const buttons = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Random Users",
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
                  if (user) {
                    setPage(link.href);
                  }
                }}
                key={link.href}
                className={`border-2 border-solid px-2 ${page === link.href ? "bg-red-500" : ""}`}
                href={user ? link.href : ""}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex gap-2 items-center">
          {user && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  onNavigate={() => {
                    setUser(null);
                    setPage(buttons[0].href);
                  }}
                  href={buttons[0].href}
                >
                  <LogOut />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Log Out</p>
              </TooltipContent>
            </Tooltip>
          )}

          <Avatar>
            <AvatarFallback className="text-xs">
              <p className="color-cyan-500">{initials}</p>
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="w-full h-16" />
    </>
  );
}
