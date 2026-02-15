import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  PlatformConnection,
  PlatformConnectionInsert,
  PlatformConnectionUpdate,
  CampaignPlatform,
} from "./types";

export function createPlatformsApi(supabase: SupabaseClient) {
  return {
    /** List all platform connections for a tenant. */
    async list(tenantId: string) {
      const { data, error } = await supabase
        .from("platform_connections")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("platform");
      if (error) throw error;
      return data as PlatformConnection[];
    },

    /** Get a specific platform connection for a tenant. */
    async getByPlatform(tenantId: string, platform: CampaignPlatform) {
      const { data, error } = await supabase
        .from("platform_connections")
        .select("*")
        .eq("tenant_id", tenantId)
        .eq("platform", platform)
        .maybeSingle();
      if (error) throw error;
      return data as PlatformConnection | null;
    },

    /** Get a connection by ID. */
    async getById(id: string) {
      const { data, error } = await supabase
        .from("platform_connections")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as PlatformConnection;
    },

    /** Upsert a platform connection (insert or update on tenant_id + platform). */
    async upsert(connection: PlatformConnectionInsert) {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("platform_connections")
        .upsert(
          { ...connection, updated_at: now },
          { onConflict: "tenant_id,platform" }
        )
        .select()
        .single();
      if (error) throw error;
      return data as PlatformConnection;
    },

    /** Update a connection by ID. */
    async update(id: string, fields: PlatformConnectionUpdate) {
      const { data, error } = await supabase
        .from("platform_connections")
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as PlatformConnection;
    },

    /** Disconnect a platform (set status to disconnected, clear tokens). */
    async disconnect(id: string) {
      const { data, error } = await supabase
        .from("platform_connections")
        .update({
          status: "disconnected",
          access_token_encrypted: null,
          refresh_token_encrypted: null,
          token_expires_at: null,
          connected_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as PlatformConnection;
    },

    /** Delete a connection entirely. */
    async delete(id: string) {
      const { error } = await supabase
        .from("platform_connections")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
  };
}
