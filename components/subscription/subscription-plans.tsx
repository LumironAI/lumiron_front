"use client"

import { useState } from "react"
import { useSubscription } from "@/hooks/use-subscription"
import { useToast } from "@/hooks/ui/use-toast"
import { SubscriptionPlansBase } from "./subscription-plans-base"

export function SubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState<string>("advanced")
  const [billingCycle, setBillingCycle] = useState<string>("monthly")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { subscription } = useSubscription()
  const { toast } = useToast()

  // Initialiser le plan sélectionné avec le plan actuel de l'utilisateur
  useState(() => {
    if (subscription?.plan_name) {
      setSelectedPlan(subscription.plan_name)
    }
  })

  // Fonction pour changer de plan d'abonnement
  const handlePlanChange = async (planId: string) => {
    // Éviter de changer pour le même plan
    if (subscription?.plan_name === planId) {
      toast({
        title: "Information",
        description: "Vous êtes déjà abonné à ce plan.",
      })
      return
    }

    setSelectedPlan(planId)
  }

  // Fonction pour changer le cycle de facturation
  const handleBillingCycleChange = (cycle: string) => {
    setBillingCycle(cycle)
  }

  // Fonction pour finaliser le changement de plan
  const handleSubmitPlanChange = async () => {
    // Éviter de soumettre le même plan
    if (subscription?.plan_name === selectedPlan) {
      return
    }

    setIsLoading(true)

    try {
      // Ici, vous implémenteriez la logique pour rediriger vers Stripe Checkout
      toast({
        title: "Fonctionnalité en développement",
        description: "Le changement de plan sera bientôt disponible.",
      })

      // Exemple de code pour rediriger vers une API de checkout (à implémenter)
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ planId: selectedPlan, billingInterval: billingCycle }),
      // });
      // const { url } = await response.json();
      // window.location.href = url;
    } catch (error) {
      console.error("Erreur lors du changement de plan:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du changement de plan.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <SubscriptionPlansBase
        selectedPlan={selectedPlan}
        onPlanChange={handlePlanChange}
        billingCycle={billingCycle}
        onBillingCycleChange={handleBillingCycleChange}
        showDetailedComparison={true}
      />

      {selectedPlan !== subscription?.plan_name && (
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmitPlanChange}
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Chargement..." : "Confirmer le changement"}
          </button>
        </div>
      )}

      <p className="text-sm text-gray-500 text-center mt-4">
        Les changements de plan prennent effet immédiatement. Un prorata sera appliqué pour la période restante.
      </p>
    </div>
  )
}
