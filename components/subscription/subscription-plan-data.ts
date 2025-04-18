// Données partagées pour les plans d'abonnement
export const subscriptionPlans = [
  {
    id: "essential",
    name: "Essentiel",
    description: "Pour les petites entreprises",
    features: [
      "1 agent vocal IA",
      "400 minutes d'appel incluses",
      "1 numéro de téléphone dédié",
      "Dépassement : 0,35€/min",
    ],
    prices: {
      monthly: "140€",
      yearly: "1400€",
    },
    color: "bg-gray-100",
    iconType: "flame",
    iconColor: "text-blue-500",
  },
  {
    id: "advanced",
    name: "Avancé",
    description: "Pour les entreprises en croissance",
    features: [
      "1 agent vocal IA",
      "1 500 minutes d'appel incluses",
      "1 numéro de téléphone dédié",
      "SMS inclus",
      "Outils avancés",
      "Dépassement : 0,35€/min",
    ],
    prices: {
      monthly: "490€",
      yearly: "4900€",
    },
    color: "bg-blue-100",
    iconType: "rocket",
    iconColor: "text-blue-500",
    popular: true,
  },
  {
    id: "expert",
    name: "Expert",
    description: "Pour les entreprises établies",
    features: [
      "2 agents vocaux IA",
      "3 000 minutes d'appel incluses",
      "2 numéros de téléphone dédiés",
      "SMS inclus",
      "Outils avancés et premium",
      "Chatbot intégré",
      "Dépassement : 0,35€/min",
    ],
    prices: {
      monthly: "890€",
      yearly: "8900€",
    },
    color: "bg-purple-100",
    iconType: "star",
    iconColor: "text-blue-500",
  },
]

// Calcul des économies pour l'abonnement annuel
export function calculateYearlySavings(
  monthlyPrice: string,
  yearlyPrice: string,
): { amount: number; percentage: number } {
  const monthlyValue = Number.parseInt(monthlyPrice.replace("€", ""))
  const yearlyValue = Number.parseInt(yearlyPrice.replace("€", ""))
  const monthlyCost = monthlyValue * 12
  const savings = monthlyCost - yearlyValue
  const savingsPercentage = Math.round((savings / monthlyCost) * 100)

  return { amount: savings, percentage: savingsPercentage }
}

// Types partagés
export type SubscriptionPlanId = "essential" | "advanced" | "expert"
export type BillingInterval = "monthly" | "yearly"

export interface SubscriptionPlanProps {
  selectedPlan: string
  onPlanChange: (planId: string) => void
  billingCycle: string
  onBillingCycleChange: (cycle: string) => void
  showDetailedComparison?: boolean
  isRegistration?: boolean
}
