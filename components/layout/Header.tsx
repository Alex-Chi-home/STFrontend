"use client";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import ConnectionStatus from "../ui/ConnectionStatus";

export default function Header() {

  function setIsOpen(isOpen: boolean) {
    console.error("set sidevar is open", isOpen);
  }



  return (
    <div className="h-18 bg-white border-b border-gray-200 flex items-center px-4">
      <button
        className="sm:hidden mr-4 p-2 hover:bg-gray-100 rounded-md"
        onClick={() => setIsOpen(true)}
      >
        <HamburgerMenuIcon className="w-6 h-6" />
      </button>
     
      <div className="flex gap-1">
         <h1 className="text-lg font-semibol flex-1">Simple PWA</h1>
              <ConnectionStatus />
          </div>
    </div>
  );
}
