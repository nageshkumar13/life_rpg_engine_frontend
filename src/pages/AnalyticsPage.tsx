import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/ChartCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorState } from "@/components/QueryErrorState";
import { useAnalyticsQuery } from "@/features/analytics/queries";

export function AnalyticsPage() {
  const { data, error, isError, isLoading } = useAnalyticsQuery();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return <QueryErrorState title="Analytics are unavailable" error={error} />;
  }

  if (!data) {
    return <QueryErrorState title="Analytics are unavailable" error={new Error("The analytics response was empty.")} />;
  }

  const plannedCompletion = Math.round(data.planned_completion_ratio * 100);
  const unplannedCompletion = Math.round(data.unplanned_completion_ratio * 100);

  return (
    <>
      <PageHeader
        eyebrow="Analytics Overview"
        title="Analytics"
        description="This dashboard now mirrors the backend overview contract: streak summary, completion ratios, focus minutes, task trends, and top habits."
      />

      <div className="mb-4 grid gap-4 md:grid-cols-4">
        <div className="panel p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Current streak</p>
          <p className="mt-3 text-4xl font-bold text-streak">{data.streak_summary.current_streak}</p>
        </div>
        <div className="panel p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Best streak</p>
          <p className="mt-3 text-4xl font-bold text-streak">{data.streak_summary.best_streak}</p>
        </div>
        <div className="panel p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Habit consistency</p>
          <p className="mt-3 text-4xl font-bold">{Math.round(data.habit_consistency_ratio * 100)}%</p>
        </div>
        <div className="panel p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Focus minutes</p>
          <p className="mt-3 text-4xl font-bold">{data.total_focus_minutes}</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="XP growth" description="Daily XP growth pulled from analytics overview.">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.xp_growth}>
              <CartesianGrid stroke="rgba(156,163,175,0.12)" vertical={false} />
              <XAxis dataKey="date" stroke="#6B7280" tickFormatter={(value) => value.slice(5)} />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }} />
              <Area type="monotone" dataKey="value" stroke="#22C55E" fill="rgba(34,197,94,0.18)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Completion rates"
          description="These are separate backend rates, not slices of one whole. Planned and unplanned work each use their own denominator."
        >
          <div className="space-y-6 px-2 py-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-text-secondary">Planned tasks</span>
                <span className="text-sm font-semibold text-info">{plannedCompletion}%</span>
              </div>
              <div className="h-3 rounded-full bg-white/5">
                <div className="h-full rounded-full bg-info transition-all duration-700" style={{ width: `${plannedCompletion}%` }} />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-text-secondary">Unplanned tasks</span>
                <span className="text-sm font-semibold text-danger">{unplannedCompletion}%</span>
              </div>
              <div className="h-3 rounded-full bg-white/5">
                <div className="h-full rounded-full bg-danger transition-all duration-700" style={{ width: `${unplannedCompletion}%` }} />
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Task completion trend" description="Completed task count by day.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.task_completion_trend}>
              <CartesianGrid stroke="rgba(156,163,175,0.12)" vertical={false} />
              <XAxis dataKey="date" stroke="#6B7280" tickFormatter={(value) => value.slice(5)} />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }} />
              <Bar dataKey="value" fill="#6366F1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top habits" description="Ranked directly from the backend overview payload.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.top_habits} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid stroke="rgba(156,163,175,0.12)" horizontal={false} />
              <XAxis type="number" stroke="#6B7280" />
              <YAxis type="category" dataKey="title" stroke="#6B7280" width={120} />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }} />
              <Bar dataKey="total_xp" fill="#22C55E" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  );
}
