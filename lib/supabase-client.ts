import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Créer un singleton pour le client Supabase côté client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

console.log("🔄 Initializing Supabase client", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl.substring(0, 10) + "...", // Ne pas afficher l'URL complète pour des raisons de sécurité
})

// Configuration de la persistance de session
const supabaseOptions = {
  auth: {
    persistSession: true, // Activer la persistance de session (par défaut)
    storageKey: "lumiron-auth-token", // Clé personnalisée pour le stockage
    autoRefreshToken: true, // Rafraîchir automatiquement le token
    detectSessionInUrl: true, // Détecter la session dans l'URL (pour les redirections après auth)
  },
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, supabaseOptions)

// Fonction pour obtenir une nouvelle instance du client
// Utile pour les composants qui ont besoin d'une nouvelle instance
export const getSupabaseClient = () => {
  console.log("🔄 Creating new Supabase client instance")
  return createClient<Database>(supabaseUrl, supabaseAnonKey, supabaseOptions)
}

// Cette fonction est utilisée pour obtenir un client authentifié
// pour les appels aux services nécessitant une authentification
export const getAuthenticatedClient = async () => {
  // Réutiliser l'instance existante car elle maintient déjà la session
  return supabase
}
