import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Tenant,
  TenantInsert,
  TenantUpdate,
  TenantUser,
  TenantUserInsert,
  ClientCompany,
  ClientCompanyInsert,
  ClientCompanyUpdate,
} from "./types";

export function createTenantsApi(supabase: SupabaseClient) {
  return {
    /* ── Tenant CRUD ─────────────────────────────────────────── */

    /** Create a new tenant. */
    async create(tenant: TenantInsert) {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("tenants")
        .insert({ ...tenant, created_at: now, updated_at: now })
        .select()
        .single();
      if (error) throw error;
      return data as Tenant;
    },

    /** Get a tenant by ID. */
    async getById(id: string) {
      const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Tenant;
    },

    /** Get a tenant by slug. */
    async getBySlug(slug: string) {
      const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as Tenant | null;
    },

    /** Update a tenant. */
    async update(id: string, updates: TenantUpdate) {
      const { data, error } = await supabase
        .from("tenants")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Tenant;
    },

    /** List all tenants (admin view). */
    async list(opts?: { search?: string; limit?: number; offset?: number }) {
      let query = supabase
        .from("tenants")
        .select("*", { count: "exact" });

      if (opts?.search) {
        query = query.or(
          `name.ilike.%${opts.search}%,owner_email.ilike.%${opts.search}%`
        );
      }

      const limit = opts?.limit ?? 50;
      const final = query.order("created_at", { ascending: false }).limit(limit);
      if (opts?.offset) final.range(opts.offset, opts.offset + limit - 1);

      const { data, error, count } = await final;
      if (error) throw error;
      return { tenants: data as Tenant[], total: count ?? 0 };
    },

    /** Delete a tenant. */
    async delete(id: string) {
      const { error } = await supabase.from("tenants").delete().eq("id", id);
      if (error) throw error;
    },

    /* ── Tenant users ────────────────────────────────────────── */

    /** Add a user to a tenant. */
    async addUser(user: TenantUserInsert) {
      const { data, error } = await supabase
        .from("tenant_users")
        .insert(user)
        .select()
        .single();
      if (error) throw error;
      return data as TenantUser;
    },

    /** List users for a tenant. */
    async listUsers(tenantId: string) {
      const { data, error } = await supabase
        .from("tenant_users")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as TenantUser[];
    },

    /** Remove a user from a tenant. */
    async removeUser(tenantId: string, userId: string) {
      const { error } = await supabase
        .from("tenant_users")
        .delete()
        .eq("tenant_id", tenantId)
        .eq("user_id", userId);
      if (error) throw error;
    },

    /** Get tenants for a given auth user (to resolve which tenant they belong to). */
    async tenantsForUser(userId: string) {
      const { data, error } = await supabase
        .from("tenant_users")
        .select("*, tenants(*)")
        .eq("user_id", userId);
      if (error) throw error;
      return data as (TenantUser & { tenants: Tenant })[];
    },

    /* ── Client companies ────────────────────────────────────── */

    /** List client companies for a tenant. */
    async listClients(
      tenantId: string,
      opts?: { search?: string; limit?: number; offset?: number }
    ) {
      let query = supabase
        .from("client_companies")
        .select("*", { count: "exact" })
        .eq("tenant_id", tenantId);

      if (opts?.search) {
        query = query.or(
          `name.ilike.%${opts.search}%,contact_email.ilike.%${opts.search}%,industry.ilike.%${opts.search}%`
        );
      }

      const limit = opts?.limit ?? 50;
      const final = query.order("name", { ascending: true }).limit(limit);
      if (opts?.offset) final.range(opts.offset, opts.offset + limit - 1);

      const { data, error, count } = await final;
      if (error) throw error;
      return { clients: data as ClientCompany[], total: count ?? 0 };
    },

    /** Get a client company by ID. */
    async getClient(id: string) {
      const { data, error } = await supabase
        .from("client_companies")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as ClientCompany;
    },

    /** Create a client company. */
    async createClient(client: ClientCompanyInsert) {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("client_companies")
        .insert({ ...client, created_at: now, updated_at: now })
        .select()
        .single();
      if (error) throw error;
      return data as ClientCompany;
    },

    /** Update a client company. */
    async updateClient(id: string, updates: ClientCompanyUpdate) {
      const { data, error } = await supabase
        .from("client_companies")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as ClientCompany;
    },

    /** Delete a client company. */
    async deleteClient(id: string) {
      const { error } = await supabase
        .from("client_companies")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
  };
}
