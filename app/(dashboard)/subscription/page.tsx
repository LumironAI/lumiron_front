import { PlanLimitsDisplay } from "@/components/subscription/plan-limits-display"
import { SubscriptionPlans } from "@/components/subscription/subscription-plans"
import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export default async function SubscriptionPage() {
  // Vérifier si l'utilisateur est connecté
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Abonnement</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <PlanLimitsDisplay />
        </div>

        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Changer de plan</h2>
            <SubscriptionPlans />
          </div>
        </div>
      </div>
    </div>
  )
}
