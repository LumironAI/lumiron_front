import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function Home() {
  // Vérifier si l'utilisateur a un token d'authentification
  const cookieStore = await cookies()
  const authToken = cookieStore.get("auth-token")?.value

  // Si l'utilisateur est déjà connecté, rediriger vers le tableau de bord
  // Sinon, rediriger vers la page de login
  if (authToken) {
    redirect("/dashboard/agents")
  } else {
    redirect("/login")
  }
}
