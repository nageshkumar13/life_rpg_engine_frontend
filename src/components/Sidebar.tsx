import { Activity, BarChart3, Clock3, ListTodo, Sparkles, UserCircle2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

const links = [
  { to: "/today", label: "Today", icon: Clock3 },
  { to: "/habits", label: "Habits", icon: Sparkles },
  { to: "/backlog", label: "Backlog", icon: ListTodo },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
];

interface SidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ mobile = false, onNavigate }: SidebarProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  const handleLogout = () => {
    clearSession();
    queryClient.clear();
    onNavigate?.();
    navigate("/", { replace: true });
  };

  return (
    <aside className={cn("flex w-72 flex-col border-r border-white/5 bg-black/15 px-5 py-6", !mobile && "hidden lg:flex")}>
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 shadow-xp">
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-text-muted">Life RPG</p>
          <h1 className="text-lg font-bold">ENGINE</h1>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-text-secondary transition hover:bg-elevated hover:text-text-primary",
                isActive && "bg-elevated text-text-primary",
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mb-4 rounded-3xl border border-white/6 bg-white/[0.03] p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Session</p>
        <p className="mt-3 text-sm font-semibold text-text-primary">{user?.email ?? "Signed in"}</p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-white/[0.06] hover:text-text-primary"
        >
          Log out
        </button>
      </div>

      <div className="rounded-3xl border border-primary/10 bg-primary/10 p-4">
        <p className="text-sm font-semibold">Momentum</p>
        <p className="mt-2 text-sm text-text-secondary">
          Small wins stack. Keep planned work high and unplanned drag low.
        </p>
      </div>
    </aside>
  );
}
