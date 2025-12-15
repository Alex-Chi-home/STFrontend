"use client";
import { ExitIcon, FaceIcon, Cross2Icon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAdminStore } from "@/lib/store/admin";

export default function Sidebar() {
  const { setSidebarIsOpen, sidebarIsOpen } = useAdminStore();

  const pathname = usePathname();

  function onClose() {
    setSidebarIsOpen(false);
  }

  const navItems = [{ name: "Chats", icon: FaceIcon, path: "/" }];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarIsOpen && (
        <div
          className="fixed inset-0 bg-gray-700 opacity-75 transition-opacity sm:hidden z-40 overflow-hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed sm:static inset-y-0 left-0 transform
        ${sidebarIsOpen ? "translate-x-0" : "-translate-x-full"}
        sm:translate-x-0 transition-transform duration-300 ease-in-out
        w-80 min-w-48 bg-gray-100 border-r border-gray-200 flex-col z-50
        flex overflow-y-auto max-h-screen
      `}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">avatar</div>
            <button
              className="sm:hidden p-2 hover:bg-gray-200 rounded-full"
              onClick={onClose}
            >
              <Cross2Icon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <ul>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`flex items-center p-2 rounded cursor-pointer
                      ${isActive ? "bg-gray-300" : "hover:bg-gray-200"}
                    `}
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
            <li className="flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer text-red-600">
              <ExitIcon className="w-5 h-5 mr-2" />
              <span>Logout</span>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
