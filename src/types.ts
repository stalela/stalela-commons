/* ── Database types ──────────────────────────────────────────────── */

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPostInsert {
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  cover_image?: string | null;
  author?: string;
  published?: boolean;
}

export interface BlogPostUpdate {
  title?: string;
  excerpt?: string | null;
  content?: string;
  cover_image?: string | null;
  author?: string;
  published?: boolean;
}

export interface Lead {
  id: string;
  email: string;
  source: string;
  name: string | null;
  phone: string | null;
  data: Record<string, unknown> | null;
  created_at: string;
}

export interface LeadInsert {
  email: string;
  source: string;
  name?: string | null;
  phone?: string | null;
  data?: Record<string, unknown> | null;
}

export interface Customer {
  id: string;
  lead_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  status: "active" | "inactive" | "prospect";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerInsert {
  lead_id?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  status?: "active" | "inactive" | "prospect";
  notes?: string | null;
}

export interface CustomerUpdate {
  name?: string;
  email?: string;
  phone?: string | null;
  company?: string | null;
  status?: "active" | "inactive" | "prospect";
  notes?: string | null;
}

export interface SeoOverride {
  id: string;
  page_path: string;
  title_override: string | null;
  meta_description: string | null;
  keywords: string[];
  og_image_url: string | null;
  updated_at: string;
}

export interface SeoOverrideUpsert {
  page_path: string;
  title_override?: string | null;
  meta_description?: string | null;
  keywords?: string[];
  og_image_url?: string | null;
}

/* ── Company directory ──────────────────────────────────────── */

export type CompanySource = "yep" | "bizcommunity" | "bestdirectory";

export interface Company {
  id: string;
  source: CompanySource;
  source_id: string;
  name: string;
  description: string | null;
  category: string | null;
  categories: string[];
  type: string | null;
  phone: string | null;
  alt_phone: string | null;
  mobile: string | null;
  whatsapp: string | null;
  email: string | null;
  contact_email: string | null;
  contact_name: string | null;
  address: string | null;
  address_line1: string | null;
  suburb: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  website: string | null;
  logo: string | null;
  source_url: string | null;
  registration_number: string | null;
  vat_number: string | null;
  seller_id: string | null;
  is_open: boolean | null;
  service_range_km: number | null;
  premium_seller: boolean | null;
  subscription_status: number | null;
  operation_hours: Record<string, unknown>[] | null;
  short_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyInsert {
  source: CompanySource;
  source_id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  categories?: string[];
  type?: string | null;
  phone?: string | null;
  alt_phone?: string | null;
  mobile?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  contact_email?: string | null;
  contact_name?: string | null;
  address?: string | null;
  address_line1?: string | null;
  suburb?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  website?: string | null;
  logo?: string | null;
  source_url?: string | null;
  registration_number?: string | null;
  vat_number?: string | null;
  seller_id?: string | null;
  is_open?: boolean | null;
  service_range_km?: number | null;
  premium_seller?: boolean | null;
  subscription_status?: number | null;
  operation_hours?: Record<string, unknown>[] | null;
  short_description?: string | null;
}

/* ── Daily briefings ────────────────────────────────────────── */

export type BriefingStatus = "pending" | "reviewed" | "sent" | "skipped";

export interface DailyBriefing {
  id: string;
  date: string;
  company_id: string;
  company_name: string;
  opportunity_type: string;
  opportunity_summary: string;
  research_summary: string | null;
  email_draft_subject: string | null;
  email_draft_body: string | null;
  call_script: string | null;
  priority: number;
  status: BriefingStatus;
  reviewed_at: string | null;
  created_at: string;
}

/* ── Daily news digest ──────────────────────────────────────── */

export interface DailyNews {
  id: string;
  date: string;
  content: string;
  topics: string[];
  created_at: string;
}

export interface DailyNewsInsert {
  date?: string;
  content: string;
  topics?: string[];
}

export interface DailyBriefingInsert {
  date?: string;
  company_id: string;
  company_name: string;
  opportunity_type: string;
  opportunity_summary: string;
  research_summary?: string | null;
  email_draft_subject?: string | null;
  email_draft_body?: string | null;
  call_script?: string | null;
  priority?: number;
  status?: BriefingStatus;
}

export interface DailyBriefingUpdate {
  status?: BriefingStatus;
  email_draft_subject?: string | null;
  email_draft_body?: string | null;
  call_script?: string | null;
  priority?: number;
  reviewed_at?: string | null;
}

export interface CompanyUpdate {
  name?: string;
  description?: string | null;
  category?: string | null;
  categories?: string[];
  type?: string | null;
  phone?: string | null;
  alt_phone?: string | null;
  mobile?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  contact_email?: string | null;
  contact_name?: string | null;
  address?: string | null;
  address_line1?: string | null;
  suburb?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  website?: string | null;
  logo?: string | null;
  source_url?: string | null;
  registration_number?: string | null;
  vat_number?: string | null;
  seller_id?: string | null;
  is_open?: boolean | null;
  service_range_km?: number | null;
  premium_seller?: boolean | null;
  subscription_status?: number | null;
  operation_hours?: Record<string, unknown>[] | null;
  short_description?: string | null;
}

/* ── B2B Marketing (Lalela) ─────────────────────────────────── */

export type TenantPlan = "free" | "premium" | "enterprise";
export type TenantStatus = "active" | "suspended" | "trial";
export type TenantUserRole = "owner" | "admin" | "member" | "viewer";
export type OnboardingStatus = "pending" | "website" | "platforms" | "complete";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  owner_email: string;
  plan: TenantPlan;
  status: TenantStatus;
  onboarding_status: OnboardingStatus;
  website_url: string | null;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface TenantInsert {
  name: string;
  slug: string;
  owner_email: string;
  plan?: TenantPlan;
  status?: TenantStatus;
  onboarding_status?: OnboardingStatus;
  website_url?: string | null;
  settings?: Record<string, unknown> | null;
}

export interface TenantUpdate {
  name?: string;
  slug?: string;
  plan?: TenantPlan;
  status?: TenantStatus;
  onboarding_status?: OnboardingStatus;
  website_url?: string | null;
  settings?: Record<string, unknown> | null;
}

export interface TenantUser {
  id: string;
  tenant_id: string;
  user_id: string;
  role: TenantUserRole;
  created_at: string;
}

export interface TenantUserInsert {
  tenant_id: string;
  user_id: string;
  role?: TenantUserRole;
}

export interface ClientCompany {
  id: string;
  tenant_id: string;
  name: string;
  industry: string | null;
  website: string | null;
  logo: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientCompanyInsert {
  tenant_id: string;
  name: string;
  industry?: string | null;
  website?: string | null;
  logo?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  notes?: string | null;
}

export interface ClientCompanyUpdate {
  name?: string;
  industry?: string | null;
  website?: string | null;
  logo?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  notes?: string | null;
}

export type CampaignPlatform = "google" | "meta" | "linkedin" | "tiktok" | "x" | "generic";
export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "archived";

export interface Campaign {
  id: string;
  tenant_id: string;
  client_company_id: string | null;
  name: string;
  objective: string | null;
  platform: CampaignPlatform;
  status: CampaignStatus;
  budget: number | null;
  currency: string;
  start_date: string | null;
  end_date: string | null;
  target_audience: Record<string, unknown> | null;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignInsert {
  tenant_id: string;
  client_company_id?: string | null;
  name: string;
  objective?: string | null;
  platform?: CampaignPlatform;
  status?: CampaignStatus;
  budget?: number | null;
  currency?: string;
  start_date?: string | null;
  end_date?: string | null;
  target_audience?: Record<string, unknown> | null;
  settings?: Record<string, unknown> | null;
}

export interface CampaignUpdate {
  client_company_id?: string | null;
  name?: string;
  objective?: string | null;
  platform?: CampaignPlatform;
  status?: CampaignStatus;
  budget?: number | null;
  currency?: string;
  start_date?: string | null;
  end_date?: string | null;
  target_audience?: Record<string, unknown> | null;
  settings?: Record<string, unknown> | null;
}

export type ContentType = "ad_copy" | "headline" | "description" | "cta" | "image_prompt" | "social_post";

export interface CampaignContent {
  id: string;
  campaign_id: string;
  content_type: ContentType;
  content: string;
  variant_label: string | null;
  approved: boolean;
  created_at: string;
}

export interface CampaignContentInsert {
  campaign_id: string;
  content_type: ContentType;
  content: string;
  variant_label?: string | null;
  approved?: boolean;
}

export interface CampaignMetrics {
  id: string;
  campaign_id: string;
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  created_at: string;
}

export interface CampaignMetricsInsert {
  campaign_id: string;
  date: string;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  spend?: number;
  revenue?: number;
}

/* ── Website Audits ─────────────────────────────────────────── */

export type AuditStatus = "pending" | "crawling" | "analyzing" | "complete" | "failed";

export interface AuditReportSection {
  title: string;
  content: string;
  score?: number;
}

export interface AuditReport {
  brand_summary: string;
  market_positioning: string;
  ad_readiness_score: number;
  recommendations: string[];
  competitor_signals: { name: string; website?: string; notes: string }[];
  sections: AuditReportSection[];
}

export interface WebsiteAudit {
  id: string;
  tenant_id: string;
  url: string;
  status: AuditStatus;
  report: AuditReport | null;
  crawl_data: Record<string, unknown> | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface WebsiteAuditInsert {
  tenant_id: string;
  url: string;
  status?: AuditStatus;
  report?: AuditReport | null;
  crawl_data?: Record<string, unknown> | null;
  error_message?: string | null;
}

/* ── Platform Connections ───────────────────────────────────── */

export type PlatformConnectionStatus = "disconnected" | "connected" | "expired" | "error";

export interface PlatformConnection {
  id: string;
  tenant_id: string;
  platform: CampaignPlatform;
  status: PlatformConnectionStatus;
  external_account_id: string | null;
  account_name: string | null;
  access_token_encrypted: string | null;
  refresh_token_encrypted: string | null;
  token_expires_at: string | null;
  scopes: string[];
  connected_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PlatformConnectionInsert {
  tenant_id: string;
  platform: CampaignPlatform;
  status?: PlatformConnectionStatus;
  external_account_id?: string | null;
  account_name?: string | null;
  access_token_encrypted?: string | null;
  refresh_token_encrypted?: string | null;
  token_expires_at?: string | null;
  scopes?: string[];
  connected_at?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface PlatformConnectionUpdate {
  status?: PlatformConnectionStatus;
  external_account_id?: string | null;
  account_name?: string | null;
  access_token_encrypted?: string | null;
  refresh_token_encrypted?: string | null;
  token_expires_at?: string | null;
  scopes?: string[];
  connected_at?: string | null;
  metadata?: Record<string, unknown> | null;
}

/* ── Competitors ────────────────────────────────────────────── */

export type CompetitorDiscovery = "manual" | "ai_audit" | "ad_library";

export interface CompetitorAnalysis {
  brand_positioning: string;
  target_audience: string;
  messaging_strategy: string;
  platform_presence: string[];
  ad_patterns: string[];
  strengths: string[];
  weaknesses: string[];
  differentiation_tips: string[];
}

export interface Competitor {
  id: string;
  tenant_id: string;
  name: string;
  website: string | null;
  industry: string | null;
  discovered_via: CompetitorDiscovery;
  notes: string | null;
  ad_analysis: CompetitorAnalysis | null;
  last_analyzed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompetitorInsert {
  tenant_id: string;
  name: string;
  website?: string | null;
  industry?: string | null;
  discovered_via?: CompetitorDiscovery;
  notes?: string | null;
  ad_analysis?: CompetitorAnalysis | null;
  last_analyzed_at?: string | null;
}

export interface CompetitorUpdate {
  name?: string;
  website?: string | null;
  industry?: string | null;
  notes?: string | null;
  ad_analysis?: CompetitorAnalysis | null;
  last_analyzed_at?: string | null;
}

