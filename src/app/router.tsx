import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/layouts/AppShell";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/today" replace />,
  },
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        path: "today",
        lazy: async () => ({ Component: (await import("@/pages/TodayPage")).TodayPage }),
      },
      {
        path: "tasks/:id",
        lazy: async () => ({ Component: (await import("@/pages/TaskDetailPage")).TaskDetailPage }),
      },
      {
        path: "habits",
        lazy: async () => ({ Component: (await import("@/pages/HabitsPage")).HabitsPage }),
      },
      {
        path: "backlog",
        lazy: async () => ({ Component: (await import("@/pages/BacklogPage")).BacklogPage }),
      },
      {
        path: "analytics",
        lazy: async () => ({ Component: (await import("@/pages/AnalyticsPage")).AnalyticsPage }),
      },
      {
        path: "profile",
        lazy: async () => ({ Component: (await import("@/pages/ProfilePage")).ProfilePage }),
      },
    ],
  },
]);
