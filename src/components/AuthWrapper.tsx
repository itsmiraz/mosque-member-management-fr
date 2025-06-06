"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "./protectedRoute";

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const publicRoutes = ["/sign-in", "/sign-up"];
console.log(pathname);
  const isPublic = publicRoutes.includes(pathname);
  console.log(isPublic);

  if (isPublic) {
    return <>{children}</>;
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
}
