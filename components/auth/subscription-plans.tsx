"use client"
import { SubscriptionPlansBase } from "@/components/subscription/subscription-plans-base"

interface SubscriptionPlansProps {
  selectedPlan: string
  onPlanChange: (planId: string) => void
  billingCycle: string
  onBillingCycleChange: (cycle: string) => void
}

export function SubscriptionPlans({
  selectedPlan,
  onPlanChange,
  billingCycle,
  onBillingCycleChange,
}: SubscriptionPlansProps) {
  return (
    <SubscriptionPlansBase
      selectedPlan={selectedPlan}
      onPlanChange={onPlanChange}
      billingCycle={billingCycle}
      onBillingCycleChange={onBillingCycleChange}
      isRegistration={true}
    />
  )
}

export default SubscriptionPlans
