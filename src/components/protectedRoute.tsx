import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppSelector, useAppDispatch } from "../redux/hooks/hooks";
import { VerifyToken } from "@/utils/verifyToken";
import { logOut } from "@/redux/feature/auth/authSlice";
import { TUser } from "@/types/global";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: string; // optionally allow different roles
}

const ProtectedRoute = ({ children, role = "client" }: ProtectedRouteProps) => {
  const { token } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If no token, redirect to login with the current URL as "from"
    if (!token) {
      const redirectTo = router.asPath;
      router.replace({
        pathname: "/auth/sign-in",
        query: { from: redirectTo },
      });
      return;
    }

    // Verify token and role
    const user = VerifyToken(token) as TUser | undefined;
    if (!user || (role && user.role !== role)) {
      // Logout user and redirect to sign-in
      dispatch(logOut());
      const redirectTo = router.asPath;
      router.replace({
        pathname: "/auth/sign-in",
        query: { from: redirectTo },
      });
      return;
    }

    setIsLoading(false);
  }, [token, role, router, dispatch]);

  if (isLoading) {
    // You can return a loader or null while checking auth
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
