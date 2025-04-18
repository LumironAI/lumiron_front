import { supabase } from "@/lib/supabase-client"

type SubscriptionPlan = "essential" | "advanced" | "expert"
type BillingInterval = "monthly" | "yearly"

export interface Subscription {
  id: string
  plan_name: SubscriptionPlan
  billing_interval: BillingInterval
  status: string
  start_date: string
  end_date: string | null
}

export interface PlanLimits {
  maxAgents: number
  maxMinutesPerMonth: number
  hasAdvancedTools: boolean
  hasPremiumTools: boolean
  hasSmsFeature: boolean
  maxPhoneNumbers: number
}

export class SubscriptionService {
  // Récupérer l'abonnement actif de l'utilisateur
  static async getCurrentSubscription(): Promise<Subscription | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .lt("start_date", new Date().toISOString())
      .or(`end_date.is.null,end_date.gt.${new Date().toISOString()}`)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) return null

    return data as Subscription
  }

  // Vérifier si l'utilisateur peut créer un nouvel agent
  static async canCreateAgent(): Promise<boolean> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return false

    // Récupérer le nombre d'agents actuels
    const { data: agents, error: agentsError } = await supabase.from("agent").select("id").eq("user_id", user.id)

    if (agentsError) return false

    // Récupérer les limites du plan
    const limits = await this.getPlanLimits()

    return (agents?.length || 0) < limits.maxAgents
  }

  // Récupérer les limites du plan actuel
  static async getPlanLimits(): Promise<PlanLimits> {
    const subscription = await this.getCurrentSubscription()

    // Limites par défaut (pas d'abonnement)
    const defaultLimits: PlanLimits = {
      maxAgents: 0,
      maxMinutesPerMonth: 0,
      hasAdvancedTools: false,
      hasPremiumTools: false,
      hasSmsFeature: false,
      maxPhoneNumbers: 0,
    }

    if (!subscription) return defaultLimits

    // Limites selon le plan
    switch (subscription.plan_name) {
      case "expert":
        return {
          maxAgents: 2,
          maxMinutesPerMonth: 3000,
          hasAdvancedTools: true,
          hasPremiumTools: true,
          hasSmsFeature: true,
          maxPhoneNumbers: 2,
        }
      case "advanced":
        return {
          maxAgents: 1,
          maxMinutesPerMonth: 1500,
          hasAdvancedTools: true,
          hasPremiumTools: false,
          hasSmsFeature: true,
          maxPhoneNumbers: 1,
        }
      case "essential":
        return {
          maxAgents: 1,
          maxMinutesPerMonth: 400,
          hasAdvancedTools: false,
          hasPremiumTools: false,
          hasSmsFeature: false,
          maxPhoneNumbers: 1,
        }
      default:
        return defaultLimits
    }
  }

  // Vérifier si un outil spécifique est disponible pour l'utilisateur
  static async isToolAvailable(toolId: string): Promise<boolean> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return false

    // Récupérer les informations sur l'outil
    const { data: tool, error: toolError } = await supabase.from("tools").select("type").eq("id", toolId).single()

    if (toolError || !tool) return false

    // Récupérer les limites du plan
    const limits = await this.getPlanLimits()

    // Vérifier si l'outil est disponible selon le type et le plan
    switch (tool.type) {
      case "basic":
        return true // Disponible pour tous les plans
      case "advanced":
        return limits.hasAdvancedTools
      case "premium":
        return limits.hasPremiumTools
      default:
        return false
    }
  }
}
