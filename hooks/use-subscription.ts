"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { useAuth } from "@/contexts/auth-context"

export type SubscriptionPlan = "essential" | "advanced" | "expert"
export type BillingInterval = "monthly" | "yearly"

export interface Subscription {
  id: string
  userId: number
  planName: SubscriptionPlan
  billingInterval: BillingInterval
  stripeSubscriptionId: string | null
  stripeCustomerId: string | null
  status: string
  startDate: string
  endDate: string | null
  createdAt: string
  updatedAt: string
}

export function useSubscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setSubscription(null)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) throw error

        if (data) {
          setSubscription({
            id: data.id,
            userId: data.user_id,
            planName: data.plan_name,
            billingInterval: data.billing_interval,
            stripeSubscriptionId: data.stripe_subscription_id,
            stripeCustomerId: data.stripe_customer_id,
            status: data.status,
            startDate: data.start_date,
            endDate: data.end_date,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          })
        } else {
          setSubscription(null)
        }
      } catch (err) {
        console.error("Error fetching subscription:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch subscription"))
        setSubscription(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscription()
  }, [user])

  const updateSubscription = async (planName: SubscriptionPlan, billingInterval: BillingInterval): Promise<boolean> => {
    if (!user || !subscription) return false

    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({
          plan_name: planName,
          billing_interval: billingInterval,
          updated_at: new Date().toISOString(),
        })
        .eq("id", subscription.id)

      if (error) throw error

      // Update local state
      setSubscription({
        ...subscription,
        planName,
        billingInterval,
        updatedAt: new Date().toISOString(),
      })

      return true
    } catch (err) {
      console.error("Error updating subscription:", err)
      return false
    }
  }

  const cancelSubscription = async (): Promise<boolean> => {
    if (!user || !subscription) return false

    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({
          status: "cancelled",
          end_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", subscription.id)

      if (error) throw error

      // Update local state
      setSubscription({
        ...subscription,
        status: "cancelled",
        endDate: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      return true
    } catch (err) {
      console.error("Error cancelling subscription:", err)
      return false
    }
  }

  return {
    subscription,
    isLoading,
    error,
    updateSubscription,
    cancelSubscription,
  }
}
