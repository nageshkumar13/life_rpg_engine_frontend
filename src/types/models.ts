export type TaskType = "PLANNED" | "UNPLANNED" | "HABIT_INSTANCE" | "BACKLOG";
export type TaskStatus = "PLANNED" | "ACTIVE" | "DONE" | "MISSED";
export type ChunkStatus = "PENDING" | "DONE";
export type HabitLogStatus = "EXPECTED" | "COMPLETED" | "MISSED";
export type BacklogStatus = "PENDING" | "ASSIGNED" | "DONE" | "ARCHIVED";
export type XPSourceType = "TASK" | "TASK_CHUNK" | "HABIT_LOG" | "REVIEW" | "BONUS";
export type HabitUnitType = "COUNT" | "MINUTES";

export interface User {
  id: string;
  email: string;
  level: number;
  total_xp: number;
  current_streak: number;
  best_streak: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface TaskChunk {
  id: string;
  task_id: string;
  title: string;
  estimated_minutes: number;
  actual_minutes: number | null;
  xp_earned: number;
  status: ChunkStatus;
  order_index: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: TaskType;
  importance_score: number;
  estimated_minutes_total: number;
  assigned_day: string;
  status: TaskStatus;
  completion_percentage: number;
  source_backlog_id: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  chunks: TaskChunk[];
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  log_date: string;
  actual_minutes: number;
  xp_earned: number;
  status: HabitLogStatus;
  streak_after_log: number;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description: string;
  unit_type: HabitUnitType;
  target_minutes: number;
  xp_base: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  logs?: HabitLog[];
}

export interface BacklogTask {
  id: string;
  user_id: string;
  title: string;
  description: string;
  importance_score: number;
  estimated_effort: number;
  xp_reward: number;
  status: BacklogStatus;
  created_at: string;
  updated_at: string;
}

export interface DailyReview {
  id: string;
  user_id: string;
  review_date: string;
  discipline_score: number;
  productivity_score: number;
  habit_score: number;
  xp_earned: number;
  planned_completed: number;
  planned_total: number;
  unplanned_completed: number;
  habit_completed: number;
  remark: string;
  created_at: string;
}

export interface XPLog {
  id: string;
  user_id: string;
  source_type: XPSourceType;
  source_id: string;
  xp_delta: number;
  reason: string;
  created_at: string;
}

export interface AnalyticsTimeseriesPoint {
  date: string;
  value: number;
}

export interface TopHabit {
  habit_id: string;
  title: string;
  total_xp: number;
  total_minutes: number;
  completion_count: number;
}

export interface AnalyticsOverview {
  xp_growth: AnalyticsTimeseriesPoint[];
  streak_summary: {
    current_streak: number;
    best_streak: number;
  };
  planned_completion_ratio: number;
  unplanned_completion_ratio: number;
  habit_consistency_ratio: number;
  total_focus_minutes: number;
  task_completion_trend: AnalyticsTimeseriesPoint[];
  top_habits: TopHabit[];
}

export interface HabitBoardItem {
  habit: Habit;
  log: HabitLog | null;
  consistency_ratio: number;
  total_minutes: number;
  total_xp: number;
}

export interface TodayStats {
  date: string;
  current_streak: number;
  best_streak: number;
  total_xp: number;
  current_level: number;
  level_xp: number;
  next_level_xp: number;
  focus_minutes: number;
  today_xp: number;
  daily_completion_ratio: number;
  completed_tracked_count: number;
  total_tracked_count: number;
}

export interface TaskDayGroup {
  date: string;
  tasks: Task[];
  total_count: number;
  completed_count: number;
  remaining_count: number;
}

export interface ScheduleWindow {
  overdue: Task[];
  missed: Task[];
  day_groups: TaskDayGroup[];
  scheduled_later_count: number;
}

export interface TodayPayload {
  stats: TodayStats;
  planned_tasks: Task[];
  unplanned_tasks: Task[];
  habit_items: HabitBoardItem[];
  completed_tasks: Task[];
  schedule_window: ScheduleWindow;
}

export interface ProfileSummary {
  user: User;
  today_focus_minutes: number;
  habits_completed_today: number;
  tasks_completed_today: number;
  total_tasks_today: number;
  today_xp: number;
}
