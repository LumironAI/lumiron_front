"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"

export function AuthDebugger() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isLoading, isAuthenticated, session } = useAuth()

  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs"
      >
        Debug Auth
      </button>

      {isOpen && (
        <div className="absolute bottom-10 right-0 w-80 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-xs">
          <h3 className="font-bold mb-2">Auth Debug Info</h3>
          <div className="space-y-1">
            <div>
              <span className="font-semibold">isAuthenticated:</span> {String(isAuthenticated)}
            </div>
            <div>
              <span className="font-semibold">isLoading:</span> {String(isLoading)}
            </div>
            <div>
              <span className="font-semibold">Has User:</span> {String(!!user)}
            </div>
            <div>
              <span className="font-semibold">Has Session:</span> {String(!!session)}
            </div>
            {user && (
              <div className="mt-2">
                <div>
                  <span className="font-semibold">User ID:</span> {user.id}
                </div>
                <div>
                  <span className="font-semibold">Email:</span> {user.email}
                </div>
                <div>
                  <span className="font-semibold">Name:</span> {user.firstName} {user.lastName}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
