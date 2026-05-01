import React from "react";
import Link from "next/link";

export default function NavBar() {
  console.log("navbar");

  const buttons = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Add Users",
      href: "/randomUser",
    },
  ];

  const height = 64 / 4;

  return (
    <>
      <div
        className={`flex gap-2 p-4 border-b-4 border-t-4 fixed top-0 left-0 bg-white w-full }`}
      >
        {buttons.map((link) => {
          return (
            <Link
              key={link.href}
              className="border-2 border-solid px-2"
              href={link.href}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <div className={`w-full h-${height} border-b-4 border-t-4`}></div>
    </>
  );
}
