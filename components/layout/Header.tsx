"use client";
import { HamburgerMenuIcon, EnterFullScreenIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

export default function Header() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  function setIsOpen(isOpen: boolean) {
    console.error("set sidevar is open", isOpen);
  }

  useEffect(() => {
    const navBar = document.getElementById("top-nav") as HTMLElement | null;

    if (isFullScreen) {
      if (navBar) {
        navBar.style.display = "none";
      }
      return;
    }

    if (navBar) {
      navBar.style.display = "block";
    }
  }, [isFullScreen]);

  return (
    <div className="h-18 bg-white border-b border-gray-200 flex items-center px-4">
      <button
        className="sm:hidden mr-4 p-2 hover:bg-gray-100 rounded-md"
        onClick={() => setIsOpen(true)}
      >
        <HamburgerMenuIcon className="w-6 h-6" />
      </button>
      <h1 className="text-lg font-semibol flex-1">ALChat PWA</h1>

      <button
        className="cursor-pointer"
        onClick={() => setIsFullScreen((prev) => !prev)}
      >
        <EnterFullScreenIcon className="w-6 h-6" />
      </button>
    </div>
  );
}
