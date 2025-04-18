export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      agent: {
        Row: {
          id: number
          name: string
          status: string
          user_id: number
          voice_profile_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          status?: string
          user_id: number
          voice_profile_id?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          status?: string
          user_id?: number
          voice_profile_id?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      agent_tools: {
        Row: {
          id: string
          agent_id: number
          tool_id: string
          is_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          agent_id: number
          tool_id: string
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agent_id?: number
          tool_id?: string
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      call_log: {
        Row: {
          id: number
          agent_id: number
          call_sid: string
          status: string
          duration: string
          external_number: string
          phone_number_id: number
          evaluation_score: number | null
          evaluation_comment: string | null
          evaluation_reasons: string | null
          audio_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          agent_id: number
          call_sid: string
          status: string
          duration: string
          external_number: string
          phone_number_id: number
          evaluation_score?: number | null
          evaluation_comment?: string | null
          evaluation_reasons?: string | null
          audio_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          agent_id?: number
          call_sid?: string
          status?: string
          duration?: string
          external_number?: string
          phone_number_id?: number
          evaluation_score?: number | null
          evaluation_comment?: string | null
          evaluation_reasons?: string | null
          audio_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: number
          name: string
          photo_url: string | null
          created_at: string
          updated_at: string
          auth_id: string
        }
        Insert: {
          id?: number
          name: string
          photo_url?: string | null
          created_at?: string
          updated_at?: string
          auth_id: string
        }
        Update: {
          id?: number
          name?: string
          photo_url?: string | null
          created_at?: string
          updated_at?: string
          auth_id?: string
        }
      }
    }
  }
}
