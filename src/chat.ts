import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ChatSession,
  ChatSessionInsert,
  ChatMessage,
  ChatMessageInsert,
} from "./types";

export function createChatApi(supabase: SupabaseClient) {
  return {
    /* ── Sessions ──────────────────────────────────────────── */

    async createSession(session: ChatSessionInsert): Promise<ChatSession> {
      const { data, error } = await supabase
        .from("chat_sessions")
        .insert({
          ...session,
          title: session.title || "New conversation",
        })
        .select()
        .single();
      if (error) throw error;
      return data as ChatSession;
    },

    async listSessions(
      tenantId: string,
      userId: string
    ): Promise<ChatSession[]> {
      const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("tenant_id", tenantId)
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as ChatSession[];
    },

    async getSession(id: string): Promise<ChatSession> {
      const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as ChatSession;
    },

    async updateSessionTitle(id: string, title: string): Promise<ChatSession> {
      const { data, error } = await supabase
        .from("chat_sessions")
        .update({ title, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as ChatSession;
    },

    async deleteSession(id: string): Promise<void> {
      // Delete messages first (cascade may handle this, but be explicit)
      const { error: msgErr } = await supabase
        .from("chat_messages")
        .delete()
        .eq("session_id", id);
      if (msgErr) throw msgErr;

      const { error } = await supabase
        .from("chat_sessions")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },

    /* ── Messages ─────────────────────────────────────────── */

    async addMessage(message: ChatMessageInsert): Promise<ChatMessage> {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert(message)
        .select()
        .single();
      if (error) throw error;

      // Touch session updated_at
      await supabase
        .from("chat_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", message.session_id);

      return data as ChatMessage;
    },

    async getMessages(sessionId: string): Promise<ChatMessage[]> {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as ChatMessage[];
    },
  };
}
