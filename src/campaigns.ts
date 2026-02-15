import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Campaign,
  CampaignInsert,
  CampaignUpdate,
  CampaignContent,
  CampaignContentInsert,
  CampaignMetrics,
  CampaignMetricsInsert,
} from "./types";

export function createCampaignsApi(supabase: SupabaseClient) {
  return {
    /* ── Campaigns ───────────────────────────────────────────── */

    /** List campaigns for a tenant with optional filters. */
    async list(
      tenantId: string,
      opts?: {
        status?: string;
        platform?: string;
        client_company_id?: string;
        search?: string;
        limit?: number;
        offset?: number;
      }
    ) {
      let query = supabase
        .from("campaigns")
        .select("*", { count: "exact" })
        .eq("tenant_id", tenantId);

      if (opts?.status) query = query.eq("status", opts.status);
      if (opts?.platform) query = query.eq("platform", opts.platform);
      if (opts?.client_company_id)
        query = query.eq("client_company_id", opts.client_company_id);
      if (opts?.search) {
        query = query.or(
          `name.ilike.%${opts.search}%,objective.ilike.%${opts.search}%`
        );
      }

      const limit = opts?.limit ?? 50;
      const final = query
        .order("updated_at", { ascending: false })
        .limit(limit);
      if (opts?.offset) final.range(opts.offset, opts.offset + limit - 1);

      const { data, error, count } = await final;
      if (error) throw error;
      return { campaigns: data as Campaign[], total: count ?? 0 };
    },

    /** Get a single campaign by ID. */
    async getById(id: string) {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Campaign;
    },

    /** Create a campaign. */
    async create(campaign: CampaignInsert) {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("campaigns")
        .insert({ ...campaign, created_at: now, updated_at: now })
        .select()
        .single();
      if (error) throw error;
      return data as Campaign;
    },

    /** Update a campaign. */
    async update(id: string, updates: CampaignUpdate) {
      const { data, error } = await supabase
        .from("campaigns")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Campaign;
    },

    /** Delete a campaign. */
    async delete(id: string) {
      const { error } = await supabase
        .from("campaigns")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },

    /* ── Campaign content ────────────────────────────────────── */

    /** List all content for a campaign. */
    async listContent(campaignId: string) {
      const { data, error } = await supabase
        .from("campaign_content")
        .select("*")
        .eq("campaign_id", campaignId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as CampaignContent[];
    },

    /** Add content to a campaign. */
    async createContent(content: CampaignContentInsert) {
      const { data, error } = await supabase
        .from("campaign_content")
        .insert(content)
        .select()
        .single();
      if (error) throw error;
      return data as CampaignContent;
    },

    /** Batch-insert multiple content items (AI generation results). */
    async createContentBatch(items: CampaignContentInsert[]) {
      const { data, error } = await supabase
        .from("campaign_content")
        .insert(items)
        .select();
      if (error) throw error;
      return data as CampaignContent[];
    },

    /** Toggle approved status on a content item. */
    async approveContent(id: string, approved: boolean) {
      const { data, error } = await supabase
        .from("campaign_content")
        .update({ approved })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as CampaignContent;
    },

    /** Delete a content item. */
    async deleteContent(id: string) {
      const { error } = await supabase
        .from("campaign_content")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },

    /* ── Campaign metrics ────────────────────────────────────── */

    /** Record metrics for a campaign on a given date. */
    async recordMetrics(metrics: CampaignMetricsInsert) {
      const { data, error } = await supabase
        .from("campaign_metrics")
        .insert(metrics)
        .select()
        .single();
      if (error) throw error;
      return data as CampaignMetrics;
    },

    /** Get metrics for a campaign, optionally within a date range. */
    async getMetrics(
      campaignId: string,
      opts?: { from?: string; to?: string }
    ) {
      let query = supabase
        .from("campaign_metrics")
        .select("*")
        .eq("campaign_id", campaignId);

      if (opts?.from) query = query.gte("date", opts.from);
      if (opts?.to) query = query.lte("date", opts.to);

      const { data, error } = await query.order("date", { ascending: true });
      if (error) throw error;
      return data as CampaignMetrics[];
    },

    /** Aggregate totals for a campaign. */
    async metricsSummary(campaignId: string) {
      const { data, error } = await supabase
        .from("campaign_metrics")
        .select("*")
        .eq("campaign_id", campaignId);
      if (error) throw error;

      const rows = data as CampaignMetrics[];
      return {
        impressions: rows.reduce((s, r) => s + r.impressions, 0),
        clicks: rows.reduce((s, r) => s + r.clicks, 0),
        conversions: rows.reduce((s, r) => s + r.conversions, 0),
        spend: rows.reduce((s, r) => s + r.spend, 0),
        revenue: rows.reduce((s, r) => s + r.revenue, 0),
        days: rows.length,
      };
    },
  };
}
