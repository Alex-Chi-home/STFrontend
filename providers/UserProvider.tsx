"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/store/user";
import { getUserAPI } from "@/lib/api/auth";

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser } = useUserStore();

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
