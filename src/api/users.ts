import { getMe } from "@/api/auth";

export async function getCurrentUser() {
  return getMe();
}
