import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";

function SessionScreen({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-12">
      <div className="panel max-w-md p-8 text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Life RPG Engine</p>
        <h1 className="mt-4 text-3xl font-bold">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary">{description}</p>
      </div>
    </div>
  );
}

export function ProtectedRoute() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  if (!hydrated) {
    return <SessionScreen title="Checking session" description="Restoring your workspace so the dashboard can load against the right account." />;
  }

  if (!token) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/login" replace state={{ from }} />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const token = useAuthStore((state) => state.token);

  if (!hydrated) {
    return <SessionScreen title="Checking session" description="Confirming whether you already have an active session." />;
  }

  if (token) {
    return <Navigate to="/today" replace />;
  }

  return <Outlet />;
}
