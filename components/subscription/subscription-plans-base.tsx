"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  subscriptionPlans,
  calculateYearlySavings,
  type BillingInterval,
  type SubscriptionPlanProps,
} from "./subscription-plan-data"

export function SubscriptionPlansBase({
  selectedPlan,
  onPlanChange,
  billingCycle,
  onBillingCycleChange,
  showDetailedComparison = false,
  isRegistration = false,
}: SubscriptionPlanProps) {
  const [showFeatureComparison, setShowFeatureComparison] = useState(showDetailedComparison)

  // Définition des options de cycle de facturation
  const billingCycleOptions = [
    { id: "monthly", label: "Mois" },
    { id: "yearly", label: "Année" },
  ]

  return (
    <div className="space-y-6">
      {/* Sélecteur de cycle de facturation */}
      <div className="flex flex-col items-center">
        <div className="inline-flex rounded-md bg-[#eef3ff] dark:bg-gray-800 p-1 mb-8">
          {billingCycleOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                billingCycle === option.id
                  ? "bg-white dark:bg-gray-700 text-[#2c90f6] shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => onBillingCycleChange(option.id)}
            >
              {option.label}
              {option.id === "yearly" && (
                <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-1.5 py-0.5 rounded-full">
                  -16%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cartes d'abonnement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => {
          const isSelected = selectedPlan === plan.id
          const billingIntervalTyped = billingCycle as BillingInterval
          const savings = calculateYearlySavings(plan.prices.monthly, plan.prices.yearly)

          return (
            <div
              key={plan.id}
              className={`border rounded-xl overflow-hidden cursor-pointer transition-all relative h-full flex flex-col ${
                isSelected
                  ? "border-[#2c90f6] border-2 bg-[#f4f9ff] dark:bg-gray-800/50 shadow-md"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
              } ${plan.popular ? "transform md:scale-105 z-10 shadow-lg" : ""}`}
              onClick={() => onPlanChange(plan.id)}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 left-0">
                  <div className="bg-[#2c90f6] text-white text-xs font-medium px-3 py-1.5 text-center">POPULAIRE</div>
                </div>
              )}

              <div className={`p-6 ${plan.popular ? "pt-8" : ""}`}>
                <div className="flex items-center mb-3">
                  <div
                    className={`h-10 w-10 ${plan.color} rounded-full flex items-center justify-center ${plan.iconColor}`}
                  >
                    {/* Placeholder pour l'icône - à remplacer par le composant d'icône approprié */}
                    <span className="text-sm font-bold">{plan.name.charAt(0)}</span>
                  </div>
                  <h4 className="font-medium text-lg ml-2">{plan.name}</h4>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{plan.description}</p>

                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold">{plan.prices[billingIntervalTyped]}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    / {billingIntervalTyped === "monthly" ? "mois" : "an"}
                  </span>
                </div>

                {billingIntervalTyped === "yearly" && (
                  <div className="mb-4 text-sm text-green-600 dark:text-green-400">
                    Économisez {savings.amount}€ par an ({savings.percentage}%)
                  </div>
                )}

                <button
                  type="button"
                  className={`w-full py-2.5 px-4 rounded-lg text-center text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-[#2c90f6] text-white"
                      : "bg-[#daebff] dark:bg-gray-700 text-[#2c90f6] dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-gray-600"
                  }`}
                >
                  {isSelected ? "Sélectionné" : "Sélectionner"}
                </button>

                {isRegistration && (
                  <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                    Essayer gratuitement pendant 7 jours
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <svg
                        className="h-4 w-4 text-[#2c90f6] mt-0.5 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Toggle de comparaison des fonctionnalités */}
      <div className="flex justify-center mt-8">
        <button
          type="button"
          onClick={() => setShowFeatureComparison(!showFeatureComparison)}
          className="text-sm text-[#2c90f6] flex items-center gap-1 hover:underline"
        >
          {showFeatureComparison ? "Masquer" : "Afficher"} la comparaison détaillée des fonctionnalités
        </button>
      </div>

      {/* Tableau de comparaison des fonctionnalités */}
      {showFeatureComparison && (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-4 px-4 font-medium">Fonctionnalités</th>
                {subscriptionPlans.map((plan) => (
                  <th key={plan.id} className="text-center py-4 px-4 font-medium">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 px-4 flex items-center">
                  Minutes offertes
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-1 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-60">Minutes gratuites pour tester le service</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
                <td className="text-center py-3 px-4">30 minutes</td>
                <td className="text-center py-3 px-4">30 minutes</td>
                <td className="text-center py-3 px-4">30 minutes</td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 px-4">Agents vocaux IA</td>
                <td className="text-center py-3 px-4">1</td>
                <td className="text-center py-3 px-4">1</td>
                <td className="text-center py-3 px-4">2</td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 px-4">Minutes d'appel incluses</td>
                <td className="text-center py-3 px-4">400</td>
                <td className="text-center py-3 px-4">1 500</td>
                <td className="text-center py-3 px-4">3 000</td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 px-4">Dépassement</td>
                <td className="text-center py-3 px-4">0,35€/min</td>
                <td className="text-center py-3 px-4">0,35€</td>
                <td className="text-center py-3 px-4">0,35€</td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 px-4">SMS inclus</td>
                <td className="text-center py-3 px-4">
                  <span className="text-red-500">✕</span>
                </td>
                <td className="text-center py-3 px-4">
                  <span className="text-green-500">✓</span>
                </td>
                <td className="text-center py-3 px-4">
                  <span className="text-green-500">✓</span>
                </td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 px-4">Numéros de téléphone dédiés</td>
                <td className="text-center py-3 px-4">1</td>
                <td className="text-center py-3 px-4">1</td>
                <td className="text-center py-3 px-4">2</td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 px-4">Chatbot intégré</td>
                <td className="text-center py-3 px-4">
                  <span className="text-red-500">✕</span>
                </td>
                <td className="text-center py-3 px-4">
                  <span className="text-red-500">✕</span>
                </td>
                <td className="text-center py-3 px-4">
                  <span className="text-green-500">✓</span>
                </td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 px-4">Limite d'appels</td>
                <td className="text-center py-3 px-4">Oui</td>
                <td className="text-center py-3 px-4">Aucune</td>
                <td className="text-center py-3 px-4">Aucune</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {isRegistration && (
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
          Tout abonnement est modifiable ou annulable dans les paramètres de votre compte *
        </p>
      )}
    </div>
  )
}
