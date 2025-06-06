"use client";
import { ReactNode, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks/hooks";
import { VerifyToken } from "@/utils/verifyToken";
import { logOut } from "@/redux/feature/auth/authSlice";
import { TUser } from "@/types/global";
import { useRouter, usePathname } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: string; // optionally allow different roles
}

const ProtectedRoute = ({ children, role = "admin" }: ProtectedRouteProps) => {
  const { token } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!token) {
      router.replace(`/sign-in?from=${pathname}`);
      return;
    }

    const user = VerifyToken(token) as TUser | undefined;
    if (!user || (role && user.role !== role)) {
      dispatch(logOut());
      router.replace(`/sign-in?from=${pathname}`);
      return;
    }

    setIsLoading(false);
  }, [token, role, router, pathname, dispatch]);
  if (isLoading) {
    // You can return a loader or null while checking auth
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
