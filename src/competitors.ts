import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Competitor,
  CompetitorInsert,
  CompetitorUpdate,
} from "./types";

export function createCompetitorsApi(supabase: SupabaseClient) {
  return {
    /** List all competitors for a tenant. */
    async list(tenantId: string) {
      const { data, error } = await supabase
        .from("competitors")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Competitor[];
    },

    /** Get a competitor by ID. */
    async getById(id: string) {
      const { data, error } = await supabase
        .from("competitors")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Competitor;
    },

    /** Create a new competitor. */
    async create(competitor: CompetitorInsert) {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("competitors")
        .insert({ ...competitor, created_at: now, updated_at: now })
        .select()
        .single();
      if (error) throw error;
      return data as Competitor;
    },

    /** Update a competitor. */
    async update(id: string, fields: CompetitorUpdate) {
      const { data, error } = await supabase
        .from("competitors")
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Competitor;
    },

    /** Delete a competitor. */
    async delete(id: string) {
      const { error } = await supabase
        .from("competitors")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
  };
}
