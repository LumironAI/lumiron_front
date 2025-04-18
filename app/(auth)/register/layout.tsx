import type { ReactNode } from "react"

interface RegisterLayoutProps {
  children: ReactNode
}

export default function RegisterLayout({ children }: RegisterLayoutProps) {
  return (
    <>
      {/* Titre principal et description - au-dessus des onglets */}
      <div className="text-center mb-6 w-full max-w-7xl">
        <h1 className="text-2xl font-bold mb-2">Créer votre compte</h1>
        <p className="text-gray-500 dark:text-gray-400">Inscrivez-vous et accédez à tous nos services</p>
      </div>

      {children}
    </>
  )
}
