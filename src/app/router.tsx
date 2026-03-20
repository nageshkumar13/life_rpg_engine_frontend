import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicOnlyRoute } from "@/components/AuthGate";
import { AppShell } from "@/layouts/AppShell";

export const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => ({ Component: (await import("@/pages/LandingPage")).LandingPage }),
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: "/login",
        lazy: async () => ({ Component: (await import("@/pages/LoginPage")).LoginPage }),
      },
      {
        path: "/signup",
        lazy: async () => ({ Component: (await import("@/pages/SignupPage")).SignupPage }),
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
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
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
