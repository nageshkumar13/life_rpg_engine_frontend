export interface AuthRedirectState {
  from?: string;
}

export function getRedirectTarget(state: unknown, fallback = "/today") {
  if (state && typeof state === "object" && "from" in state) {
    const from = Reflect.get(state, "from");
    if (typeof from === "string" && from.startsWith("/")) {
      return from;
    }
  }

  return fallback;
}

export function getRedirectState(state: unknown): AuthRedirectState | undefined {
  const from = getRedirectTarget(state, "");

  if (!from) {
    return undefined;
  }

  return { from };
}

export function formatRedirectLabel(target: string) {
  if (target === "/today") {
    return "today's dashboard";
  }

  if (target === "/profile") {
    return "your profile";
  }

  if (target === "/analytics") {
    return "analytics";
  }

  if (target === "/habits") {
    return "the habits board";
  }

  if (target === "/backlog") {
    return "the backlog";
  }

  if (target.startsWith("/tasks/")) {
    return "that task detail view";
  }

  return "the page you asked for";
}
