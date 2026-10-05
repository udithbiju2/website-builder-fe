import { createContext, useContext } from "react";
import type { AuthUser, LoginInput } from "../api/auth.ts";

export type AuthContextValue = {
  user: AuthUser | null;
  /** True until the initial session check finishes. */
  loading: boolean;
  login: (input: LoginInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  /** Store a user returned by a session-creating call (verify email, reset password). */
  setSessionUser: (user: AuthUser) => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
