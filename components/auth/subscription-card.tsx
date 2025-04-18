"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { SubscriptionIcon } from "./subscription-icons"

export interface SubscriptionOption {
  id: string
  name: string
  price: { monthly: string; yearly: string }
  description: string
  features: string[]
  icon: "flame" | "rocket" | "star"
  color: string
  iconColor: string
  popular?: boolean
}

interface SubscriptionCardProps {
  option: SubscriptionOption
  isSelected: boolean
  billingCycle: "monthly" | "yearly"
  onClick: () => void
}

export function SubscriptionCard({ option, isSelected, billingCycle, onClick }: SubscriptionCardProps) {
  // Calcul des économies pour l'abonnement annuel
  const getSavings = () => {
    if (billingCycle !== "yearly") return null

    const monthlyPrice = Number.parseInt(option.price.monthly.replace("€", ""))
    const yearlyPrice = Number.parseInt(option.price.yearly.replace("€", ""))
    const monthlyCost = monthlyPrice * 12
    const savings = monthlyCost - yearlyPrice
    const savingsPercentage = Math.round((savings / monthlyCost) * 100)

    return { amount: savings, percentage: savingsPercentage }
  }

  const savings = getSavings()

  return (
    <div
      className={cn(
        "border rounded-xl overflow-hidden cursor-pointer transition-all relative h-full flex flex-col",
        isSelected
          ? "border-[#2c90f6] border-2 bg-[#f4f9ff] dark:bg-gray-800/50 shadow-md"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800",
        option.popular && "transform md:scale-105 z-10 shadow-lg",
      )}
      onClick={onClick}
    >
      {option.popular && (
        <div className="absolute top-0 right-0 left-0">
          <div className="bg-[#2c90f6] text-white text-xs font-medium px-3 py-1.5 text-center">POPULAIRE</div>
        </div>
      )}

      <div className={cn("p-6", option.popular && "pt-8")}>
        <div className="flex items-center mb-3">
          <div
            className={`h-10 w-10 ${option.color} rounded-full flex items-center justify-center ${option.iconColor}`}
          >
            <SubscriptionIcon type={option.icon} />
          </div>
          <h4 className="font-medium text-lg ml-2">{option.name}</h4>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{option.description}</p>

        <div className="flex items-baseline mb-4">
          <span className="text-3xl font-bold">{option.price[billingCycle]}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
            / {billingCycle === "monthly" ? "mois" : "an"}
          </span>
        </div>

        {billingCycle === "yearly" && savings && (
          <div className="mb-4 text-sm text-green-600 dark:text-green-400">
            Économisez {savings.amount}€ par an ({savings.percentage}%)
          </div>
        )}

        <button
          type="button"
          className={cn(
            "w-full py-2.5 px-4 rounded-lg text-center text-sm font-medium transition-colors",
            isSelected
              ? "bg-[#2c90f6] text-white"
              : "bg-[#daebff] dark:bg-gray-700 text-[#2c90f6] dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-gray-600",
          )}
        >
          {isSelected ? "Sélectionné" : "Sélectionner"}
        </button>

        <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          Essayer gratuitement pendant 7 jours
        </div>

        <div className="mt-6 space-y-3">
          {option.features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check className="h-4 w-4 text-[#2c90f6] mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
