import { jwtDecode } from "jwt-decode";

export const VerifyToken = (token: string) => {
  return jwtDecode(token);
};
