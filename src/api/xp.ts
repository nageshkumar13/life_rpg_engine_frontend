import { apiRequest } from "@/api/client";
import type { XPLog } from "@/types/models";

export async function getXpLogs() {
  const response = await apiRequest<{ items: XPLog[] }>("/xp/logs");
  return response.items;
}
