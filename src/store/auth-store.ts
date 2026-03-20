import { create } from "zustand";
import { clearAuthSession, getStoredAccessToken, getStoredAuthUser, storeAuthSession, storeAuthUser } from "@/lib/session";
import type { User } from "@/types/models";

interface AuthStore {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  setSession: (token: string, user: User) => void;
  setUser: (user: User) => void;
  clearSession: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: getStoredAccessToken(),
  user: getStoredAuthUser(),
  hydrated: false,
  setSession: (token, user) => {
    storeAuthSession(token, user);
    set({ token, user, hydrated: true });
  },
  setUser: (user) => {
    storeAuthUser(user);
    set({ user, hydrated: true });
  },
  clearSession: () => {
    clearAuthSession();
    set({ token: null, user: null, hydrated: true });
  },
  setHydrated: (hydrated) => set({ hydrated }),
}));
