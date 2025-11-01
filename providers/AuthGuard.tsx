"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/lib/store/user";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user?.id) {
      router.push("/login");
      return;
    }

    if (user && pathname === "/login") {
      router.replace("/");
      return;
    }
  }, [user, router, pathname]);

  return <>{children}</>;
}
