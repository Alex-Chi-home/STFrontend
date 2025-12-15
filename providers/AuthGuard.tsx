"use client";

import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  useEffect(() => {}, []);

  return <>{children}</>;
}
