import { useSubscription } from "@/hooks/use-subscription"

export function PlanLimitsDisplay() {
  const { subscription, planLimits, loading, error } = useSubscription()

  if (loading) {
    return <div className="p-4 bg-gray-100 rounded-lg">Chargement des informations d'abonnement...</div>
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Une erreur est survenue lors du chargement de votre abonnement.
      </div>
    )
  }

  if (!subscription || !planLimits) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">
        Vous n'avez pas d'abonnement actif. Veuillez souscrire à un plan pour accéder à toutes les fonctionnalités.
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Votre abonnement</h2>

      <div className="mb-4">
        <span className="font-medium">Plan:</span> <span className="capitalize">{subscription.planName}</span>
        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          {subscription.billingInterval === "monthly" ? "Mensuel" : "Annuel"}
        </span>
      </div>

      <h3 className="text-lg font-medium mb-2">Limites et fonctionnalités</h3>

      <ul className="space-y-2">
        <li className="flex items-center justify-between">
          <span>Agents</span>
          <span className="font-medium">{planLimits.maxAgents}</span>
        </li>
        <li className="flex items-center justify-between">
          <span>Minutes d'appel par mois</span>
          <span className="font-medium">{planLimits.maxMinutesPerMonth}</span>
        </li>
        <li className="flex items-center justify-between">
          <span>Numéros de téléphone</span>
          <span className="font-medium">{planLimits.maxPhoneNumbers}</span>
        </li>
        <li className="flex items-center justify-between">
          <span>Outils avancés</span>
          <span className="font-medium">{planLimits.hasAdvancedTools ? "✓" : "✗"}</span>
        </li>
        <li className="flex items-center justify-between">
          <span>Outils premium</span>
          <span className="font-medium">{planLimits.hasPremiumTools ? "✓" : "✗"}</span>
        </li>
        <li className="flex items-center justify-between">
          <span>SMS</span>
          <span className="font-medium">{planLimits.hasSmsFeature ? "✓" : "✗"}</span>
        </li>
      </ul>
    </div>
  )
}
