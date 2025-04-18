"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/ui/use-toast"
import { supabase } from "@/lib/supabase-client"
import type { User as SupabaseUser, Session, AuthChangeEvent } from "@supabase/supabase-js"

// Define types for our context
export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  supabaseUser?: SupabaseUser // Add Supabase user for reference
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  subscription?: string
}

// Add a stable authentication state
interface AuthContextType {
  user: User | null
  isLoading: boolean
  session: Session | null
  isAuthenticated: boolean // Add this new property
  login: (email: string, password: string, fromPath: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<boolean>
  resetPassword: (token: string, newPassword: string) => Promise<boolean>
  refreshSession: () => Promise<void>
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  console.log("🔄 AuthProvider initializing")
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // Inside AuthProvider component, add:
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Utility function for delays
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Improve the getUserFromSession function to handle delays better using retry logic
  const getUserFromSession = async (session: Session | null) => {
    console.log("🔍 Getting user from session", { sessionExists: !!session })
    if (!session) return null

    const MAX_RETRIES = 3;
    const INITIAL_DELAY = 500; // ms

    const fetchUserData = async () => {
        return await supabase
            .from("users")
            .select("*")
            .eq("auth_id", session.user.id)
            .single();
    };

    try {
      // Initial fetch attempt
      console.log("🔍 Fetching user data from Supabase with auth_id:", session.user.id)
      let { data: userData, error } = await fetchUserData();

      // Retry logic specifically for "no rows" or "multiple rows" error, likely after registration
      if (error && (error.message.includes("no rows") || error.message.includes("multiple"))) {
          console.warn(`⏳ User data not immediately found for ${session.user.id}, initiating retries...`);
          let currentDelay = INITIAL_DELAY;
          for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
              console.log(`⏳ Retry attempt ${attempt}/${MAX_RETRIES} after ${currentDelay}ms...`);
              await delay(currentDelay);
              const { data: retryData, error: retryError } = await fetchUserData();

              if (retryData) {
                  console.log(`✅ User data fetched on retry attempt ${attempt}:`, retryData);
                  userData = retryData; // Use the successfully fetched data
                  error = null;       // Clear the error
                  break;              // Exit retry loop
              }

              if (retryError && !(retryError.message.includes("no rows") || retryError.message.includes("multiple"))) {
                  // If a different error occurs during retry, don't continue retrying for "no rows"
                  console.error(`❌ Non-recoverable error on retry attempt ${attempt}:`, retryError);
                  error = retryError; // Keep the latest significant error
                  break; // Exit retry loop
              } else if (retryError) {
                  console.warn(`⏳ Still no user data on attempt ${attempt}:`, retryError.message);
              }

              // Increase delay for next attempt (exponential backoff)
              currentDelay *= 2;
          }
      }

      // Handle final error state after initial fetch or retries
      if (error) {
        console.error("❌ Error fetching user data after retries (or initial non-retry error):", error);
        // Fallback to minimal user object if still no data
        console.log("⚠️ Creating minimal user from session data as fallback");
        return {
          id: -1, // Temporary ID
          firstName: session.user.user_metadata?.first_name || "",
          lastName: session.user.user_metadata?.last_name || "",
          email: session.user.email || "",
          phone: session.user.phone || session.user.user_metadata?.phone || "",
          role: "user",
          supabaseUser: session.user,
          // Add a flag to indicate this user data might be incomplete
          // isTemporary: true,
        } as User; // Consider defining a type that includes isTemporary if needed downstream
      }

      // Process successful fetch (initial or retry)
      console.log("✅ User data fetched successfully:", userData);
      if (userData) {
        return {
          id: userData.id,
          firstName: userData.first_name || userData.name?.split(" ")[0] || "",
          lastName: userData.last_name || userData.name?.split(" ")[1] || "",
          email: userData.email || session.user.email || "",
          phone: userData.phone || session.user.phone || "",
          role: userData.role || "user",
          supabaseUser: session.user,
        } as User
      }

      console.log("⚠️ No user data found for auth_id:", session.user.id)
      return null
    } catch (error) {
      console.error("💥 Error in getUserFromSession:", error)
      return null
    }
  }

  // Fonction pour rafraîchir la session
  const refreshSession = async () => {
    console.log("🔄 Refreshing session")

    // Avoid multiple calls by checking if we're already loading
    if (isLoading) {
      console.log("⏭️ Already refreshing session, skipping")
      return
    }

    try {
      setIsLoading(true)
      const {
        data: { session: currentSession },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("❌ Error getting session:", sessionError)
        throw sessionError
      }

      console.log("🔑 Session refreshed:", { exists: !!currentSession })
      setSession(currentSession)

      if (currentSession) {
        const userData = await getUserFromSession(currentSession)
        console.log("👤 User data from refreshed session:", userData)
        setUser(userData)
      } else {
        console.log("⚠️ No session found during refresh")
        setUser(null)
      }
    } catch (error) {
      console.error("💥 Error refreshing session:", error)
      setUser(null)
      setSession(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Check if the user is authenticated on mount
  useEffect(() => {
    console.log("🔄 AuthProvider useEffect running")
    const initializeAuth = async () => {
      try {
        console.log("🔍 Initializing authentication")
        setIsLoading(true)

        // Get the current session from Supabase
        console.log("🔍 Getting session from Supabase")
        const {
          data: { session: currentSession },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("❌ Error getting session:", sessionError)
          throw sessionError
        }

        console.log("🔑 Session retrieved:", { exists: !!currentSession })
        setSession(currentSession)

        if (currentSession) {
          console.log("👤 Getting user data from session")
          const userData = await getUserFromSession(currentSession)
          console.log("👤 User data set:", userData)
          setUser(userData)
        } else {
          console.log("⚠️ No session found during initialization")
        }
      } catch (error) {
        console.error("💥 Authentication initialization failed:", error)
        setUser(null)
        setSession(null)
      } finally {
        console.log("✅ Authentication initialization completed")
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Set up auth state listener
    console.log("🔄 Setting up auth state listener")
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, newSession: Session | null) => {
      console.log("🔔 Auth state changed:", event, newSession?.user?.email)

      setSession(newSession)

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        console.log("🔑 User signed in or token refreshed")
        if (newSession) {
          const userData = await getUserFromSession(newSession)
          console.log("👤 User data after sign in:", userData)
          setUser(userData)
        }
      } else if (event === "SIGNED_OUT") { // Rely on SIGNED_OUT for session invalidation
        console.log("🚪 User signed out") // Update log message
        setUser(null)
        setSession(null)
        router.push("/login")
      }
    })

    // Cleanup subscription on unmount
    return () => {
      console.log("🧹 Cleaning up auth state listener")
      subscription.unsubscribe()
    }
  }, [router])

  // Add effect to update isAuthenticated state
  useEffect(() => {
    const authenticated = !!user && !!session
    setIsAuthenticated(authenticated)
    console.log("🔒 Authentication state updated:", { authenticated })
  }, [user, session])

  // Register function
  const register = async (data: RegisterData): Promise<boolean> => {
    console.log("📝 Register attempt for email:", data.email)
    setIsLoading(true)
    try {
      // Register with Supabase Auth
      console.log("🔍 Calling Supabase signUp")
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            role: "user",
          },
        },
      })

      if (authError) {
        console.error("❌ Registration error from Supabase:", authError)
        throw authError
      }

      console.log("✅ Supabase registration response:", { user: !!authData.user })
      if (authData.user) {
        // Create user in public.users table
        console.log("👤 Creating user in users table")
        const { data: userData, error: userError } = await supabase
          .from("users")
          .insert({
            auth_id: authData.user.id,
            name: `${data.firstName} ${data.lastName}`,
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone: data.phone,
            role: "user",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (userError) {
          console.error("❌ Error creating user in users table:", userError)
          throw userError
        }

        console.log("👤 User created in users table:", userData)

        // Create subscription if provided
        if (data.subscription && userData) {
          console.log("💳 Creating subscription:", data.subscription)
          const { error: subscriptionError } = await supabase.from("subscriptions").insert({
            user_id: userData.id,
            plan_name: data.subscription as any, // Type assertion needed
            billing_interval: "monthly",
            status: "active",
            start_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (subscriptionError) {
            console.error("❌ Error creating subscription:", subscriptionError)
            throw subscriptionError
          }

          console.log("💳 Subscription created successfully")
        }

        // Get created user to update context (getUserFromSession now handles potential delays)
        const newUserData = await getUserFromSession({
          ...authData.session!,
          user: authData.user,
        })

        if (newUserData) {
          setUser(newUserData)
          setSession(authData.session)
        }

        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès",
          variant: "success",
        })

        router.push("/dashboard/agents")
        return true
      }

      console.log("⚠️ No user returned from Supabase during registration")
      return false
    } catch (error) {
      console.error("💥 Registration failed:", error)
      toast({
        title: "Échec de l'inscription",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Login function
  // Add fromPath parameter
  const login = async (email: string, password: string, fromPath: string): Promise<boolean> => {
    console.log("🔑 Login attempt for email:", email)
    setIsLoading(true)
    try {
      console.log("🔍 Calling Supabase signInWithPassword")
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("❌ Login error from Supabase:", error)
        throw error
      }

      console.log("✅ Supabase login response:", { user: !!data.user, session: !!data.session })
      if (data.user) {
        // Get user data immediately
        const userData = await getUserFromSession(data.session)

        if (userData) {
          setUser(userData)
          setSession(data.session)

          // Session will be updated automatically via onAuthStateChange
          toast({
            title: "Connexion réussie",
            description: "Bienvenue sur Lumiron Dashboard",
            variant: "success",
          })

          // Use router.push for client-side navigation
          console.log(`🚀 Triggering client-side redirect to ${fromPath} after login`)
          router.push(fromPath);
          return true;
        } else {
          console.error("❌ User data not found after login")
          toast({
            title: "Échec de la connexion",
            description: "Impossible de récupérer vos données utilisateur",
            variant: "destructive",
          })
          return false
        }
      }

      console.log("⚠️ No user returned from Supabase")
      return false
    } catch (error) {
      console.error("💥 Login failed:", error)
      toast({
        title: "Échec de la connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    console.log("🚪 Logout attempt")
    try {
      console.log("🔍 Calling Supabase signOut")
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("❌ Logout error from Supabase:", error)
        throw error
      }

      console.log("✅ Logout successful")
      // La session sera mise à jour automatiquement via onAuthStateChange
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      })
    } catch (error) {
      console.error("💥 Logout failed:", error)
      toast({
        title: "Échec de la déconnexion",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  // Forgot password function
  const forgotPassword = async (email: string): Promise<boolean> => {
    console.log("🔑 Forgot password attempt for email:", email)
    setIsLoading(true)
    try {
      console.log("🔍 Calling Supabase resetPasswordForEmail")
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        console.error("❌ Forgot password error from Supabase:", error)
        throw error
      }

      console.log("✅ Password reset email sent")
      setIsLoading(false)
      toast({
        title: "Email envoyé",
        description: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation",
      })
      return true
    } catch (error) {
      console.error("💥 Forgot password request failed:", error)
      setIsLoading(false)
      toast({
        title: "Échec de la demande",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      })
      return false
    }
  }

  // Reset password function
  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    console.log("🔑 Reset password attempt")
    setIsLoading(true)
    try {
      console.log("🔍 Calling Supabase updateUser")
      // In Supabase, the token is handled via the URL and not directly in the function
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        console.error("❌ Reset password error from Supabase:", error)
        throw error
      }

      console.log("✅ Password reset successful")
      setIsLoading(false)
      toast({
        title: "Mot de passe réinitialisé",
        description: "Votre mot de passe a été réinitialisé avec succès",
        variant: "success",
      })
      return true
    } catch (error) {
      console.error("💥 Password reset failed:", error)
      setIsLoading(false)
      toast({
        title: "Échec de la réinitialisation",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      })
      return false
    }
  }

  // Update the context value
  const contextValue: AuthContextType = {
    user,
    isLoading,
    session,
    isAuthenticated, // Add this to the context value
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    refreshSession,
  }

  console.log("🔄 AuthProvider rendering", {
    hasUser: !!user,
    isLoading,
    hasSession: !!session,
  })

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    console.error("❌ useAuth must be used within an AuthProvider")
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
