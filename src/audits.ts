import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  WebsiteAudit,
  WebsiteAuditInsert,
  AuditReport,
} from "./types";

export function createAuditsApi(supabase: SupabaseClient) {
  return {
    /** Create a new website audit record. */
    async create(audit: WebsiteAuditInsert) {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("website_audits")
        .insert({ ...audit, created_at: now, updated_at: now })
        .select()
        .single();
      if (error) throw error;
      return data as WebsiteAudit;
    },

    /** Get an audit by ID. */
    async getById(id: string) {
      const { data, error } = await supabase
        .from("website_audits")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as WebsiteAudit;
    },

    /** Get the latest audit for a tenant. */
    async getLatest(tenantId: string) {
      const { data, error } = await supabase
        .from("website_audits")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as WebsiteAudit | null;
    },

    /** List all audits for a tenant. */
    async list(tenantId: string) {
      const { data, error } = await supabase
        .from("website_audits")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as WebsiteAudit[];
    },

    /** Update audit status and optionally the report. */
    async update(id: string, fields: { status?: string; report?: AuditReport | null; crawl_data?: Record<string, unknown> | null; error_message?: string | null }) {
      const { data, error } = await supabase
        .from("website_audits")
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as WebsiteAudit;
    },

    /** Delete an audit. */
    async delete(id: string) {
      const { error } = await supabase
        .from("website_audits")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
  };
}
