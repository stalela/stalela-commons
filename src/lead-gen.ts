import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  GeneratedLead,
  GeneratedLeadInsert,
  GeneratedLeadUpdate,
} from "./types";

export function createLeadGenApi(supabase: SupabaseClient) {
  return {
    /** List generated leads for a tenant, ordered by relevance score desc. */
    async list(
      tenantId: string,
      opts?: {
        status?: string;
        limit?: number;
        offset?: number;
      }
    ) {
      let query = supabase
        .from("generated_leads")
        .select("*", { count: "exact" })
        .eq("tenant_id", tenantId);

      if (opts?.status) query = query.eq("status", opts.status);

      const limit = opts?.limit ?? 50;
      const final = query
        .order("relevance_score", { ascending: false })
        .limit(limit);
      if (opts?.offset) final.range(opts.offset, opts.offset + limit - 1);

      const { data, error, count } = await final;
      if (error) throw error;
      return { leads: data as GeneratedLead[], total: count ?? 0 };
    },

    /** Get a single generated lead by ID. */
    async getById(id: string) {
      const { data, error } = await supabase
        .from("generated_leads")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as GeneratedLead;
    },

    /** Create a single generated lead. */
    async create(lead: GeneratedLeadInsert) {
      const { data, error } = await supabase
        .from("generated_leads")
        .insert(lead)
        .select()
        .single();
      if (error) throw error;
      return data as GeneratedLead;
    },

    /** Bulk-insert generated leads (up to 10). */
    async createBatch(leads: GeneratedLeadInsert[]) {
      const { data, error } = await supabase
        .from("generated_leads")
        .insert(leads)
        .select();
      if (error) throw error;
      return data as GeneratedLead[];
    },

    /** Update lead status or notes. */
    async update(id: string, updates: GeneratedLeadUpdate) {
      const { data, error } = await supabase
        .from("generated_leads")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as GeneratedLead;
    },

    /** Delete a generated lead. */
    async delete(id: string) {
      const { error } = await supabase
        .from("generated_leads")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
  };
}
