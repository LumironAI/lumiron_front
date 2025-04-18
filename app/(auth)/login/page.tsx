"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/auth/form-field"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "/agents"

  // Ajouter un log au chargement de la page
  useEffect(() => {
    console.log("🔍 Login page loaded", { from })

    // Vérifier si les dépendances sont chargées correctement
    console.log("📚 Dependencies check:", {
      router: !!router,
      searchParams: !!searchParams,
      useAuth: !!login,
    })

    return () => {
      console.log("🔄 Login page unmounted")
    }
  }, [router, searchParams, login, from])

  const validateForm = () => {
    console.log("🔎 Validating form", { email, password: password ? "***" : "" })
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "L'email est invalide"
    }

    if (!password) {
      newErrors.password = "Le mot de passe est requis"
    }

    setErrors(newErrors)
    const isValid = Object.keys(newErrors).length === 0
    console.log("✅ Form validation result:", { isValid, errors: newErrors })
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("🚀 Login form submitted")

    if (!validateForm()) {
      console.log("❌ Form validation failed")
      return
    }

    setIsSubmitting(true)
    console.log("⏳ Starting login process")

    try {
      const success = await login(email, password)
      console.log("🔑 Login result:", { success })

      if (success) {
        console.log("✅ Login successful, redirecting to:", from)
        router.push(from)
      } else {
        console.log("❌ Login failed but no error was thrown")
      }
    } catch (error) {
      console.error("💥 Login error:", error)
    } finally {
      console.log("🏁 Login process completed")
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>

      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Nom d'utilisateur ou adresse email" error={errors.email}>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }))
                }
              }}
              className={errors.email ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
          </FormField>

          <div className="space-y-2">
            <FormField label="Mot de passe" error={errors.password}>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: undefined }))
                    }
                  }}
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
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
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#2c90f6] hover:bg-[#2c90f6]/90 text-white rounded-[10px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Vous n&apos;avez pas encore de compte ?{" "}
          <Link href="/register" className="text-primary hover:underline">
            S&apos;inscrire
          </Link>
        </div>
      </div>
    </div>
  )
}
