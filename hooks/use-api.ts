"use client"

import { useState, useCallback, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/ui/use-toast"

interface ApiOptions {
  headers?: Record<string, string>
  withAuth?: boolean
}

interface ApiResponse<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
}

export function useApi() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const apiCallRef = useRef<(
    <T>(
      url: string,
      method: string,
      body?: any,
      options?: ApiOptions
    ) => Promise<ApiResponse<T>>
  ) | null>(null);

  const get = useCallback(
    <T>(url: string, options?: ApiOptions) => apiCallRef.current!<T>(url, "GET", undefined, options),
    []
  )

  const post = useCallback(
    <T>(url: string, data: any, options?: ApiOptions) => apiCallRef.current!<T>(url, "POST", data, options),
    []
  )

  const put = useCallback(
    <T>(url: string, data: any, options?: ApiOptions) => apiCallRef.current!<T>(url, "PUT", data, options),
    []
  )

  const del = useCallback(
    <T>(url: string, options?: ApiOptions) => apiCallRef.current!<T>(url, "DELETE", undefined, options),
    []
  )


  const apiCall = useCallback(
    async <T>(
      url: string,
      method: string,
      body?: any,
      options: ApiOptions = { withAuth: true }
    ): Promise<ApiResponse<T>> => {
      setIsLoading(true)

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api"
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          ...options.headers,
        }

        // Add authorization header if withAuth is true and user is logged in
        if (options.withAuth && user) {
          headers["Authorization"] = `Bearer ${user.token}`
        }

        const response = await fetch(`${baseUrl}${url}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        })

        if (!response.ok) {
          // Handle different error status codes
          if (response.status === 401) {
            toast({
              title: "Session expirée",
              description: "Veuillez vous reconnecter",
              variant: "destructive",
            })
            // You could trigger a logout here
          } else if (response.status === 403) {
            toast({
              title: "Accès refusé",
              description: "Vous n'avez pas les permissions nécessaires",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Erreur",
              description: "Une erreur est survenue lors de la requête",
              variant: "destructive",
            })
          }

          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        return { data, error: null, isLoading: false }
      } catch (error) {
        console.error(`API error for ${url}:`, error)
        return {
          data: null,
          error: error instanceof Error ? error : new Error(String(error)),
          isLoading: false,
        }
      } finally {
        setIsLoading(false)
      }
    },
    [user, toast]
  )

  apiCallRef.current = apiCall;

  return {
    get,
    post,
    put,
    delete: del,
    isLoading,
  }
}
