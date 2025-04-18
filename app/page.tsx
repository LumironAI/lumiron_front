import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default function Home() {
  // Vérifier si l'utilisateur a un token d'authentification
  const authToken = cookies().get("auth-token")?.value

  // Si l'utilisateur est déjà connecté, rediriger vers le tableau de bord
  // Sinon, rediriger vers la page de login
  if (authToken) {
    redirect("/agents")
  } else {
    redirect("/login")
  }
}
