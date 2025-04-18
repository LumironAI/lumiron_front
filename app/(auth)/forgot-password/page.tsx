"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/auth/form-field"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<{ email?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { forgotPassword } = useAuth()

  const validateForm = () => {
    const newErrors: { email?: string } = {}

    if (!email) {
      newErrors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "L'email est invalide"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const success = await forgotPassword(email)
      if (success) {
        setIsSubmitted(true)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="text-2xl font-bold text-center mb-6">Mot de passe oublié</h1>

      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm w-full max-w-md">
        {isSubmitted ? (
          <div className="text-center space-y-4">
            <p className="text-green-600">
              Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.
            </p>
            <p className="text-sm text-gray-500">
              Veuillez vérifier votre boîte de réception et suivre les instructions.
            </p>
            <div className="mt-6">
              <Link href="/login">
                <Button className="w-full rounded-[10px]">Retour à la connexion</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField label="Adresse email" error={errors.email}>
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

              <Button
                type="submit"
                className="w-full bg-[#2c90f6] hover:bg-[#2c90f6]/90 text-white rounded-[10px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Envoyer le lien de réinitialisation"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <Link href="/login" className="text-primary hover:underline">
                Retour à la connexion
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
