import { supabase } from "@/lib/supabase-client"

export interface UserProfile {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  photoUrl?: string
  role: string
  createdAt: string
  updatedAt: string
}

export class UserService {
  /**
   * Récupère le profil utilisateur par ID
   */
  static async getUserById(id: number): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

      if (error) throw error

      if (!data) return null

      return {
        id: data.id,
        firstName: data.first_name || data.name?.split(" ")[0] || "",
        lastName: data.last_name || data.name?.split(" ")[1] || "",
        email: data.email || "",
        phone: data.phone || "",
        photoUrl: data.photo_url || undefined,
        role: data.role || "user",
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      return null
    }
  }

  /**
   * Récupère le profil utilisateur par auth_id
   */
  static async getUserByAuthId(authId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("auth_id", authId).single()

      if (error) throw error

      if (!data) return null

      return {
        id: data.id,
        firstName: data.first_name || data.name?.split(" ")[0] || "",
        lastName: data.last_name || data.name?.split(" ")[1] || "",
        email: data.email || "",
        phone: data.phone || "",
        photoUrl: data.photo_url || undefined,
        role: data.role || "user",
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error("Error fetching user by auth ID:", error)
      return null
    }
  }

  /**
   * Met à jour le profil utilisateur
   */
  static async updateUserProfile(userId: number, profile: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const updateData = {
        first_name: profile.firstName,
        last_name: profile.lastName,
        name: profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : undefined,
        email: profile.email,
        phone: profile.phone,
        photo_url: profile.photoUrl,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("users").update(updateData).eq("id", userId).select().single()

      if (error) throw error

      if (!data) return null

      return {
        id: data.id,
        firstName: data.first_name || data.name?.split(" ")[0] || "",
        lastName: data.last_name || data.name?.split(" ")[1] || "",
        email: data.email || "",
        phone: data.phone || "",
        photoUrl: data.photo_url || undefined,
        role: data.role || "user",
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error("Error updating user profile:", error)
      return null
    }
  }
}
