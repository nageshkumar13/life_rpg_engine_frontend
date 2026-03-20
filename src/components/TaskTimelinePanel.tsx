import { ArrowRight, CalendarClock, CircleAlert, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatShortDate, formatWeekday } from "@/lib/utils";
import type { ScheduleWindow, Task } from "@/types/models";

interface TaskTimelinePanelProps {
  scheduleWindow: ScheduleWindow;
  today: string;
}

function statusTone(task: Task, today: string) {
  if (task.status === "DONE") {
    return "border-xp/20 bg-xp/10 text-xp";
  }

  if (task.status === "MISSED") {
    return "border-danger/20 bg-danger/10 text-danger";
  }

  if (task.assigned_day < today) {
    return "border-streak/20 bg-streak/10 text-streak";
  }

  return "border-white/10 bg-white/[0.04] text-text-secondary";
}

export function TaskTimelinePanel({ scheduleWindow, today }: TaskTimelinePanelProps) {
  return (
    <div className="panel p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Schedule Horizon</p>
          <h3 className="mt-2 text-xl font-semibold">Today, carryover, and what is scheduled next</h3>
          <p className="mt-2 text-sm text-text-secondary">
            This shows what is still open from earlier days and what is already scheduled later. There is no backend transfer history yet,
            so later-dated tasks are shown as scheduled later rather than transferred.
          </p>
        </div>
        <div className="grid min-w-[240px] gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-streak/20 bg-streak/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.22em] text-streak/80">Carryover</p>
            <p className="mt-2 text-2xl font-semibold text-text-primary">{scheduleWindow.overdue.length}</p>
          </div>
          <div className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.22em] text-danger/80">Missed</p>
            <p className="mt-2 text-2xl font-semibold text-text-primary">{scheduleWindow.missed.length}</p>
          </div>
          <div className="rounded-2xl border border-info/20 bg-info/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.22em] text-info/80">Scheduled later</p>
            <p className="mt-2 text-2xl font-semibold text-text-primary">{scheduleWindow.scheduled_later_count}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {scheduleWindow.day_groups.map((group) => {
          const isToday = group.date === today;

          return (
            <div
              key={group.date}
              className={`rounded-3xl border px-5 py-4 ${isToday ? "border-primary/25 bg-primary/10" : "border-white/5 bg-white/[0.03]"}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${isToday ? "bg-xp shadow-xp" : group.date < today ? "bg-danger" : "bg-info"}`} />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-text-primary">{formatShortDate(group.date)}</p>
                      <p className="text-sm text-text-secondary">{formatWeekday(group.date)}</p>
                      {isToday ? (
                        <span className="rounded-full bg-xp/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-xp">
                          Today
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-text-secondary">
                      {group.completed_count}/{group.total_count} completed
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm text-text-secondary">
                  <Clock3 className="h-4 w-4" />
                  {group.remaining_count} open
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {group.tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between gap-3 rounded-2xl bg-black/10 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-text-primary">{task.title}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${statusTone(task, today)}`}>
                          {task.status}
                        </span>
                        <span className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-text-secondary">
                          {task.type.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/tasks/${task.id}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-text-secondary transition-all duration-200 ease-out hover:bg-elevated hover:text-text-primary"
                    >
                      Open
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {!scheduleWindow.day_groups.length ? (
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] px-5 py-10 text-center">
            <CalendarClock className="mx-auto h-8 w-8 text-text-muted" />
            <p className="mt-4 text-lg font-semibold text-text-primary">No nearby scheduled tasks</p>
            <p className="mt-2 text-sm text-text-secondary">Once work is assigned across days, it will show up here as a cleaner schedule view.</p>
          </div>
        ) : null}

        {scheduleWindow.overdue.length ? (
          <div className="rounded-3xl border border-streak/20 bg-streak/10 px-5 py-4">
            <div className="flex items-center gap-2 text-streak">
              <CircleAlert className="h-4 w-4" />
              <p className="text-sm font-semibold uppercase tracking-[0.22em]">Carryover needs attention</p>
            </div>
            <p className="mt-2 text-sm text-text-secondary">
              {scheduleWindow.overdue.length} task{scheduleWindow.overdue.length === 1 ? "" : "s"} were planned earlier and are still open.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
