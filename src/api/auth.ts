import { request } from "./http.ts";

export type UserRole = "SUPER_ADMIN" | "CLIENT";
export type UserStatus = "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  client: { id: string; businessName: string } | null;
  createdAt: string;
};

type SessionResponse = { user: AuthUser };

export type VerificationDispatch = {
  email: string;
  emailSent: boolean;
  resendAvailableInSeconds: number;
};

export type SignupInput = {
  fullName: string;
  businessName: string;
  email: string;
  password: string;
  phone?: string;
  acceptTerms: boolean;
};

export type LoginInput = {
  email: string;
  password: string;
  remember: boolean;
};

export const authApi = {
  signup: (input: SignupInput) =>
    request<VerificationDispatch>("/auth/signup", { method: "POST", body: input }),

  verifyEmail: (email: string, code: string) =>
    request<SessionResponse>("/auth/verify-email", { method: "POST", body: { email, code } }),

  resendVerification: (email: string) =>
    request<VerificationDispatch>("/auth/resend-verification", { method: "POST", body: { email } }),

  login: (input: LoginInput) =>
    request<SessionResponse>("/auth/login", { method: "POST", body: input }),

  logout: () => request<void>("/auth/logout", { method: "POST" }),

  me: () => request<SessionResponse>("/auth/me"),

  forgotPassword: (email: string) =>
    request<void>("/auth/forgot-password", { method: "POST", body: { email } }),

  previewPasswordReset: (token: string) =>
    request<{ email: string; isInvite: boolean }>(`/auth/reset-password?token=${encodeURIComponent(token)}`),

  resetPassword: (token: string, password: string) =>
    request<SessionResponse>("/auth/reset-password", { method: "POST", body: { token, password } }),
};
