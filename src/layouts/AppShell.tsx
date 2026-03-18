import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { QuickAddModal } from "@/components/QuickAddModal";
import { XpToastLayer } from "@/components/XpToastLayer";

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />

      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="h-full w-72 bg-bg px-5 py-6" onClick={(event) => event.stopPropagation()}>
            <Sidebar mobile onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      ) : null}

      <main className="min-h-screen flex-1">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-bg/80 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl border border-white/10 p-2 text-text-secondary"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold tracking-[0.2em] text-text-muted">LIFE RPG ENGINE</span>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>

      <QuickAddModal />
      <XpToastLayer />
    </div>
  );
}
