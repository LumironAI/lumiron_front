"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { useAuth } from "@/contexts/auth-context"

interface Profile {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  role: string
  avatar_url?: string
  updated_at: string
}

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (error) throw error

        setProfile(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch profile"))
        console.error("Error fetching profile:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!user) return false

    try {
      setIsLoading(true)
      const { error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      // Refetch profile to get updated data
      const { data, error: fetchError } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (fetchError) throw fetchError

      setProfile(data)
      return true
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update profile"))
      console.error("Error updating profile:", err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { profile, isLoading, error, updateProfile }
}
