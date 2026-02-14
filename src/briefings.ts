import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  DailyBriefing,
  DailyBriefingInsert,
  DailyBriefingUpdate,
  BriefingStatus,
} from "./types";

export function createBriefingsApi(supabase: SupabaseClient) {
  return {
    /** List briefings for a specific date, ordered by priority. */
    async listByDate(date: string, status?: BriefingStatus) {
      let query = supabase
        .from("daily_briefings")
        .select("*", { count: "exact" })
        .eq("date", date)
        .order("priority", { ascending: true })
        .order("company_name", { ascending: true });

      if (status) query = query.eq("status", status);

      const { data, error, count } = await query;
      if (error) throw error;
      return { items: data as DailyBriefing[], total: count ?? 0 };
    },

    /** List recent briefing dates (for the date picker / history). */
    async listDates(limit = 14) {
      const { data, error } = await supabase
        .from("daily_briefings")
        .select("date")
        .order("date", { ascending: false })
        .limit(limit * 10); // over-fetch since we deduplicate

      if (error) throw error;

      // Deduplicate dates
      const seen = new Set<string>();
      const dates: string[] = [];
      for (const row of data ?? []) {
        if (!seen.has(row.date)) {
          seen.add(row.date);
          dates.push(row.date);
          if (dates.length >= limit) break;
        }
      }
      return dates;
    },

    /** Get a single briefing by ID. */
    async getById(id: string) {
      const { data, error } = await supabase
        .from("daily_briefings")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as DailyBriefing;
    },

    /** Create a new briefing (used by the daily agent). */
    async create(briefing: DailyBriefingInsert) {
      const { data, error } = await supabase
        .from("daily_briefings")
        .insert(briefing)
        .select("id")
        .single();
      if (error) throw error;
      return data as { id: string };
    },

    /** Upsert a briefing (one per company per date). */
    async upsert(briefing: DailyBriefingInsert) {
      const { data, error } = await supabase
        .from("daily_briefings")
        .upsert(briefing, { onConflict: "company_id,date" })
        .select("id")
        .single();
      if (error) throw error;
      return data as { id: string };
    },

    /** Update a briefing (e.g. mark as reviewed/sent/skipped). */
    async update(id: string, updates: DailyBriefingUpdate) {
      const { error } = await supabase
        .from("daily_briefings")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },

    /** Get summary stats for a date. */
    async statsForDate(date: string) {
      const { data, error } = await supabase
        .from("daily_briefings")
        .select("status")
        .eq("date", date);
      if (error) throw error;

      const rows = data ?? [];
      return {
        total: rows.length,
        pending: rows.filter((r) => r.status === "pending").length,
        reviewed: rows.filter((r) => r.status === "reviewed").length,
        sent: rows.filter((r) => r.status === "sent").length,
        skipped: rows.filter((r) => r.status === "skipped").length,
      };
    },
  };
}
