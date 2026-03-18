import { useQuery } from "@tanstack/react-query";
import { getAnalytics, getProfileSummary } from "@/api/analytics";

export function useAnalyticsQuery() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalytics,
  });
}

export function useProfileQuery() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfileSummary,
  });
}
