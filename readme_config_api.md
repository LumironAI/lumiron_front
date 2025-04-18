# Guide de transition vers la production

Ce document détaille les étapes nécessaires pour préparer l'application Lumiron Dashboard à un déploiement en production.

## 1. Service API

### 1.1 Mise à jour du service API

Le service API a été modifié pour détecter automatiquement l'environnement et adapter son comportement en conséquence. Voici les principales modifications :

\`\`\`typescript
// Dans services/api.ts
constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "/api") {
  this.baseUrl = baseUrl
  // Détection automatique de l'environnement
  this.isPreview =
    process.env.NODE_ENV !== "production" ||
    (typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
       window.location.hostname.includes("vercel.app") ||
       window.location.hostname.includes("preview")))
}

1.2 Gestion des erreurs en production
Les méthodes du service API ont été modifiées pour propager les erreurs en production au lieu de retourner des données simulées :

// Exemple pour la méthode get
async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // En prévisualisation, simuler la réponse
  if (this.isPreview) {
    console.log(`[Preview] GET ${endpoint}`)
    return this.mockResponse<T>(endpoint)
  }

  try {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    // En cas d'erreur en production, propager l'erreur
    if (!this.isPreview) {
      throw error
    }
    // En prévisualisation, retourner une réponse simulée
    return this.mockResponse<T>(endpoint)
  }
}
1.3 Sécurisation de mockResponse
La méthode mockResponse a été modifiée pour vérifier qu'elle n'est jamais appelée en production :

private mockResponse<T>(endpoint: string, data?: any): Promise<T> {
  // Vérifier si nous sommes en production
  if (!this.isPreview) {
    throw new Error("mockResponse should not be called in production")
  }
  
  // Reste du code...
}
2. Suppression des éléments de prévisualisation
2.1 Suppression du hook use-is-preview.ts
Ce hook n'est plus nécessaire car la détection de l'environnement est maintenant gérée directement dans le service API.

# Supprimer le fichier
rm hooks/use-is-preview.ts
2.2 Suppression des bannières de prévisualisation
Supprimer les bannières de prévisualisation des pages suivantes :

app/agents/[id]/informations/page.tsx
app/agents/[id]/configuration/page.tsx
app/agents/[id]/recapitulatif/page.tsx
Exemple de code à supprimer :

<div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md mb-6 flex items-center">
  <AlertCircle className="h-5 w-5 mr-2" />
  <div>
    <p className="font-medium">Mode prévisualisation</p>
    <p className="text-sm">Les appels API sont simulés dans cet environnement.</p>
  </div>
</div>
2.3 Suppression des messages toast de prévisualisation
Supprimer les messages toast qui indiquent que l'application est en mode prévisualisation :

// Supprimer ce code des pages
useEffect(() => {
  toast({
    title: "Mode prévisualisation",
    description: "Les appels API sont simulés dans cet environnement",
    variant: "default",
  })
}, [toast])
3. Configuration des variables d'environnement
3.1 Création du fichier .env.production
Créer un fichier .env.production à la racine du projet avec les variables d'environnement nécessaires pour la production :

NEXT_PUBLIC_API_URL=https://api.lumiron.com
3.2 Configuration des variables d'environnement sur Vercel
Si vous déployez sur Vercel, configurez les variables d'environnement dans les paramètres du projet :

Accédez à votre projet sur le dashboard Vercel
Allez dans "Settings" > "Environment Variables"
Ajoutez la variable NEXT_PUBLIC_API_URL avec la valeur de l'URL de votre API de production
4. Gestion des erreurs
4.1 Mise en place d'un système de gestion des erreurs
Pour une meilleure expérience utilisateur en production, implémentez un système de gestion des erreurs :

// Exemple de composant ErrorBoundary
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Ici, vous pourriez envoyer l'erreur à un service de monitoring
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Une erreur est survenue.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
5. Tests avant déploiement
Avant de déployer en production, effectuez les tests suivants :

Test de connexion à l'API : Vérifiez que l'application se connecte correctement à l'API de production
Test des formulaires : Vérifiez que tous les formulaires fonctionnent correctement
Test de navigation : Vérifiez que toutes les routes fonctionnent correctement
Test de performance : Vérifiez les performances de l'application avec des outils comme Lighthouse
Test de compatibilité : Vérifiez que l'application fonctionne sur différents navigateurs et appareils
6. Déploiement
6.1 Build de production
Pour générer un build de production :

npm run build
6.2 Déploiement sur Vercel
Pour déployer sur Vercel :

Connectez votre dépôt GitHub à Vercel
Configurez les variables d'environnement comme indiqué dans la section 3.2
Déployez l'application
7. Surveillance et maintenance
7.1 Mise en place d'un système de monitoring
Envisagez d'intégrer un service de monitoring comme Sentry pour suivre les erreurs en production :

npm install @sentry/nextjs
7.2 Mise en place d'analytics
Intégrez un service d'analytics pour suivre l'utilisation de l'application :

npm install @vercel/analytics
Puis ajoutez-le à votre application :

// Dans app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
8. Conclusion
En suivant ces étapes, votre application Lumiron Dashboard sera prête pour un déploiement en production. Assurez-vous de tester minutieusement chaque fonctionnalité avant de déployer pour garantir une expérience utilisateur optimale.


<Actions>
  <Action name="Ajouter des instructions de sauvegarde" description="Inclure des recommandations pour la sauvegarde des données" />
  <Action name="Détailler la stratégie de déploiement" description="Ajouter des informations sur les stratégies de déploiement (blue/green, canary, etc.)" />
  <Action name="Ajouter une section sur la sécurité" description="Inclure des recommandations de sécurité pour l'environnement de production" />
  <Action name="Créer une checklist de déploiement" description="Ajouter une liste de vérification à suivre avant chaque déploiement" />
  <Action name="Documenter la procédure de rollback" description="Expliquer comment revenir à une version précédente en cas de problème" />
</Actions>
