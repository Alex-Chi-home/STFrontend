"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/lib/store/user";
import { getUserAPI } from "@/lib/api/auth";

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const [userLoaded, setUserLoaded] = useState(false);
  useEffect(() => {
    async function getUser() {
      const userData = await getUserAPI();
      setUser(userData);
      setUserLoaded(true);
    }
    if (!userLoaded) {
      getUser();
    }
  }, [setUser, userLoaded]);

  return <>{children}</>;
}
