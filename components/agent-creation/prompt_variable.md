# Backend: Construction Dynamique des Prompts

Le frontend gère la sélection du genre et du type de voix par l'utilisateur et détermine le `voice_profile_id` correspondant, qui est ensuite sauvegardé dans la table `agent`.

Le backend (ou la fonction serverless/edge function qui interagit avec l'API de l'IA/TTS) est responsable de prendre ce `voice_profile_id`, les données spécifiques de l'agent, et de construire le prompt final à envoyer au service externe.

## Processus Requis Côté Backend

1.  **Identifier l'Agent et le Profil Vocal:**
    *   Lorsqu'une interaction nécessitant le prompt se produit (ex: un appel entrant pour un agent spécifique), récupérez l'enregistrement complet de l'agent concerné depuis la table `agent`.
    *   Notez le `voice_profile_id` stocké pour cet agent.

2.  **Récupérer le Template du Prompt:**
    *   Utilisez le `voice_profile_id` pour récupérer l'enregistrement correspondant depuis la table `voice_profiles`.
    *   Extrayez la valeur de la colonne `prompt_template`. C'est votre modèle de base.

3.  **Préparer les Données de l'Agent:**
    *   Rassemblez toutes les informations de l'agent qui sont utilisées comme variables dans le template (ex: `name`, `address`, `city`, `website`, `openingHours`, `options`, `foodOptions`, `establishment`, `sector`, etc.).
    *   **Formatage des Données Complexes:** Certaines données nécessiteront un formatage pour être insérées de manière lisible dans le prompt :
        *   **`openingHours` (jsonb):** Convertissez la structure JSON en une chaîne de caractères compréhensible (ex: "Ouvert du Mardi au Samedi de 12h à 14h30 et de 19h à 22h30, le Dimanche de 12h à 14h30."). Prévoyez une logique pour gérer les jours de fermeture et les services uniques (midi ou soir seulement).
        *   **`closureDays` (jsonb):** Si `enabled` est `true`, formatez les `dates` en une phrase (ex: "Nous serons exceptionnellement fermés du 10/07/2025 au 15/07/2025.").
        *   **`options` / `foodOptions` (jsonb):** Listez les options activées (clés avec valeur `true`) de manière naturelle (ex: "Nous disposons d'un accès PMR et acceptons les animaux.").
        *   **`establishment` / `sector`:** Peuvent être utilisés directement ou pour construire des phrases (ex: "un restaurant italien", "un hôtel spécialisé dans...").
        *   **`integrations` (jsonb):** Bien que probablement non utilisées directement dans le prompt *vocal*, ces informations pourraient être utiles pour la logique interne de l'agent IA (savoir quels outils sont disponibles).

4.  **Effectuer le Remplacement des Variables (Templating):**
    *   Parcourez le `prompt_template` récupéré.
    *   Pour chaque variable placeholder (ex: `{{nom du restaurant}}`, `{{adresse du restaurant}}`, `{{horaire du restaurant}}`), remplacez-la par la donnée correspondante et formatée de l'agent.
    *   Utilisez une bibliothèque de templating (comme Handlebars, Mustache, etc. si votre stack backend le permet) ou une simple logique de remplacement de chaînes (attention aux cas limites).
    *   **Gestion des Données Manquantes:** Assurez-vous que si une donnée de l'agent est `NULL` ou vide (ex: `website`), le remplacement se fait correctement (soit par une chaîne vide, soit par une mention comme "non spécifié", selon ce qui est préférable pour le prompt).

5.  **Utiliser le Prompt Finalisé:**
    *   Le résultat de l'étape 4 est le prompt complet et personnalisé pour l'agent spécifique.
    *   Envoyez ce prompt finalisé à l'API de votre modèle de langage (LLM) ou de synthèse vocale (TTS).

## Exemple Conceptuel

*   **Input Agent Data:**
    *   `name`: "La Bonne Fourchette"
    *   `address`: "12 Rue Principale"
    *   `city`: "Lyon"
    *   `voice_profile_id`: 2 (correspondant à Sandrine)
    *   `openingHours`: (JSON pour Mardi-Samedi 12h-14h30, 19h-22h30)
*   **Input Template (extrait de `voice_profiles` where `id`=2):**
    ```
    Tu es Sandrine, une professionnelle expérimentée travaillant comme réceptionniste pour le restaurant **{{nom du restaurant}}**, [...] situé au **{{adresse du restaurant}}**. [...] ouvert {{horaire du restaurant}}.
    ```
*   **Output Prompt Finalisé (après formatage et remplacement):**
    ```
    Tu es Sandrine, une professionnelle expérimentée travaillant comme réceptionniste pour le restaurant **La Bonne Fourchette**, [...] situé au **12 Rue Principale**. [...] ouvert du Mardi au Samedi de 12h à 14h30 et de 19h à 22h30.
    ```

## Conclusion

Cette approche backend garantit que chaque agent IA utilise un prompt adapté à sa personnalité (via le template) et aux informations spécifiques de l'établissement qu'il représente (via les données de l'agent), offrant ainsi une expérience utilisateur cohérente et précise.
