import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Créer un singleton pour le client Supabase côté client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

console.log("🔄 Initializing Supabase client", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl.substring(0, 10) + "...", // Ne pas afficher l'URL complète pour des raisons de sécurité
})

export const supabase = createPagesBrowserClient<Database>({ supabaseUrl, supabaseKey: supabaseAnonKey })

// Fonction pour obtenir une nouvelle instance du client
// Utile pour les composants qui ont besoin d'une nouvelle instance
export const getSupabaseClient = () => {
  console.log("🔄 Creating new Supabase client instance")
  return createPagesBrowserClient<Database>({ supabaseUrl, supabaseKey: supabaseAnonKey })
}

// Cette fonction est utilisée pour obtenir un client authentifié
// pour les appels aux services nécessitant une authentification
export const getAuthenticatedClient = async () => {
  // Réutiliser l'instance existante car elle maintient déjà la session
  return supabase
}
