import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getMe } from "@/api/auth";
import { router } from "@/app/router";
import { useAuthStore } from "@/store/auth-store";

function AuthBootstrap() {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setHydrated = useAuthStore((state) => state.setHydrated);
  const lastTokenRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (lastTokenRef.current === token) {
      return;
    }

    lastTokenRef.current = token;
    let isActive = true;

    const hydrate = async () => {
      if (!token) {
        if (isActive) {
          setHydrated(true);
        }
        return;
      }

      if (isActive) {
        setHydrated(false);
      }

      try {
        const user = await getMe();
        if (isActive) {
          setUser(user);
          setHydrated(true);
        }
      } catch {
        if (isActive) {
          clearSession();
        }
      }
    };

    void hydrate();

    return () => {
      isActive = false;
    };
  }, [clearSession, setHydrated, setUser, token]);

  return null;
}

export function AppProviders() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30000,
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
