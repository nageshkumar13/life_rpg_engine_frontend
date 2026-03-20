import { apiRequest } from "@/api/client";
import type { AuthResponse, User } from "@/types/models";

export function signup(input: { email: string; password: string }) {
  return apiRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    body: input,
  });
}

export function login(input: { email: string; password: string }) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: input,
  });
}

export function getMe() {
  return apiRequest<User>("/auth/me");
}
