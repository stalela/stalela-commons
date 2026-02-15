import type { SupabaseClient } from "@supabase/supabase-js";
import type { DailyNews, DailyNewsInsert } from "./types";

export function createNewsApi(supabase: SupabaseClient) {
  return {
    /** Get the news digest for a specific date. */
    async getByDate(date: string) {
      const { data, error } = await supabase
        .from("daily_news")
        .select("*")
        .eq("date", date)
        .maybeSingle();
      if (error) throw error;
      return data as DailyNews | null;
    },

    /** List dates that have news digests (for the date picker). */
    async listDates(limit = 14) {
      const { data, error } = await supabase
        .from("daily_news")
        .select("date")
        .order("date", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []).map((r) => r.date as string);
    },

    /** Upsert a news digest (one per date). */
    async upsert(news: DailyNewsInsert) {
      const { data, error } = await supabase
        .from("daily_news")
        .upsert(news, { onConflict: "date" })
        .select("id")
        .single();
      if (error) throw error;
      return data as { id: string };
    },
  };
}
