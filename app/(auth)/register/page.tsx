"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/auth/form-field"
import { PhoneInput } from "@/components/auth/phone-input"
import { AuthTabs } from "@/components/auth/auth-tabs"
import { useAuth, type RegisterData } from "@/contexts/auth-context"
import { Loader2, Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react"
import SubscriptionPlans from "@/components/auth/subscription-plans"

// Définition des onglets pour le formulaire d'inscription
const registrationTabs = [
  { id: "personal", label: "Informations personnelles" },
  { id: "subscription", label: "Abonnements" },
]

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState("personal")
  const [formData, setFormData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    subscription: "advanced", // Par défaut, le plan populaire
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [shouldValidate, setShouldValidate] = useState(false)
  const [countryCode, setCountryCode] = useState("fr")

  const { register } = useAuth()
  const router = useRouter()

  const validatePersonalInfo = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!formData.lastName) {
      newErrors.lastName = "Le nom est requis"
    }

    if (!formData.firstName) {
      newErrors.firstName = "Le prénom est requis"
    }

    if (!formData.email) {
      newErrors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email est invalide"
    }

    if (!formData.phone) {
      newErrors.phone = "Le téléphone est requis"
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis"
    } else if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "La confirmation du mot de passe est requise"
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, confirmPassword])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Effacer l'erreur lorsque l'utilisateur tape
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)

    // Effacer l'erreur lorsque l'utilisateur tape
    if (errors.confirmPassword) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.confirmPassword
        return newErrors
      })
    }
  }

  const handleCountryChange = (country: string) => {
    setCountryCode(country)
  }

  const handleSubscriptionChange = (subscriptionId: string) => {
    setFormData((prev) => ({ ...prev, subscription: subscriptionId }))
  }

  const handleNextStep = () => {
    if (activeTab === "personal") {
      // Activer la validation
      setShouldValidate(true)

      if (validatePersonalInfo()) {
        setActiveTab("subscription")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (activeTab === "personal") {
      handleNextStep()
      return
    }

    setIsSubmitting(true)

    try {
      const success = await register(formData)
      if (success) {
        router.push("/agents")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white dark:bg-card border dark:border-border rounded-lg shadow-sm overflow-hidden">
        <AuthTabs tabs={registrationTabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {activeTab === "personal" && (
              <div className="max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Nom" required error={shouldValidate ? errors.lastName : undefined}>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={shouldValidate && errors.lastName ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                  </FormField>

                  <FormField label="Prénom" required error={shouldValidate ? errors.firstName : undefined}>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={shouldValidate && errors.firstName ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                  </FormField>
                </div>

                <FormField label="Adresse email" required error={shouldValidate ? errors.email : undefined}>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={shouldValidate && errors.email ? "border-red-500" : ""}
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField label="Téléphone" required error={shouldValidate ? errors.phone : undefined}>
                  <PhoneInput
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onCountryChange={handleCountryChange}
                    countryValue={countryCode}
                    error={shouldValidate ? errors.phone : undefined}
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField label="Mot de passe" required error={shouldValidate ? errors.password : undefined}>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className={shouldValidate && errors.password ? "border-red-500 pr-10" : "pr-10"}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={togglePasswordVisibility}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormField>

                <FormField
                  label="Confirmation de mot de passe"
                  required
                  error={shouldValidate ? errors.confirmPassword : undefined}
                >
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      className={shouldValidate && errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={toggleConfirmPasswordVisibility}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormField>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  Les champs marqués d'une <span className="text-red-500">*</span> sont obligatoires
                </p>
              </div>
            )}

            {activeTab === "subscription" && (
              <SubscriptionPlans
                selectedPlan={formData.subscription}
                onPlanChange={handleSubscriptionChange}
                billingCycle={billingCycle}
                onBillingCycleChange={setBillingCycle}
              />
            )}

            <div className="flex justify-between mt-8">
              {activeTab === "subscription" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("personal")}
                  disabled={isSubmitting}
                  className="dark:border-gray-600 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Précédent
                </Button>
              )}
              <div className={activeTab === "personal" ? "ml-auto" : ""}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#2c90f6] hover:bg-[#2c90f6]/90 text-white flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {activeTab === "personal" ? "Chargement..." : "Valider"}
                    </>
                  ) : activeTab === "personal" ? (
                    <>
                      Suivant
                      <ArrowRight size={16} />
                    </>
                  ) : (
                    "Valider"
                  )}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Vous avez déjà un compte ?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
