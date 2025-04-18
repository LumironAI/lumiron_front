# Authentication Redirection Loop Refinement Plan

## Problem Analysis

The application experiences a redirection loop after user login. Client-side logs indicate a successful login and initiation of redirection to `/dashboard/agents`. However, server-side middleware logs show a failure to detect the user's session (`AuthSessionMissingError`), causing the middleware to redirect the unauthenticated user back to `/login`.

The root cause was identified as a mismatch in session handling mechanisms between the client-side Supabase setup and the Next.js middleware:

1.  **Client-Side (`lib/supabase-client.ts`):** Used the standard `createClient` from `@supabase/supabase-js` with options (`persistSession: true`, `storageKey: "lumiron-auth-token"`) that likely resulted in session data being stored in `localStorage` under the custom key.
2.  **Middleware (`middleware.ts`):** Used `createMiddlewareClient` from `@supabase/auth-helpers-nextjs`, which expects session information to be stored in **cookies** for proper cross-context (client/server/middleware) session management in Next.js.

This discrepancy meant the session established and stored in `localStorage` by the client was not accessible via cookies to the middleware during the subsequent navigation request.

## Solution

Align both client-side and middleware session handling by using the `@supabase/auth-helpers-nextjs` library consistently. This ensures session information is managed via cookies, making it accessible across different Next.js rendering contexts.

## Implementation Steps

1.  **Modify `lib/supabase-client.ts`:**
    *   Change the import from `createClient` to `createBrowserClient`:
        ```typescript
        // Before: import { createClient } from "@supabase/supabase-js"
        // After:
        import { createBrowserClient } from "@supabase/auth-helpers-nextjs"
        ```
    *   Update the client creation call to use `createBrowserClient`:
        ```typescript
        // Before: export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, supabaseOptions)
        // After:
        export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)

        // Also update getSupabaseClient if it exists/is used:
        // Before: return createClient<Database>(supabaseUrl, supabaseAnonKey, supabaseOptions)
        // After:
        return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
        ```
    *   Remove the custom `supabaseOptions` object (lines defining `persistSession`, `storageKey`, etc.), as `createBrowserClient` handles cookie storage automatically.

2.  **(Recommended) Revert Redirect Method in `contexts/auth-context.tsx`:**
    *   Ensure the `login` function uses Next.js client-side navigation instead of a full page reload.
    *   Pass the intended destination path (e.g., `from` obtained from `useSearchParams` in the login page) to the `login` function.
    *   Inside the `login` function, use `router.push(destinationPath)` instead of `window.location.assign(...)`.
        ```typescript
        // Example inside login function in auth-context.tsx
        // Assuming 'router' is available and 'destinationPath' is passed in:

        // Remove or comment out:
        // window.location.assign("/dashboard/agents");

        // Use:
        router.push(destinationPath);
        ```

## Expected Outcome

After implementing these changes, the client-side login will store the session in a cookie managed by the Auth Helpers library. When navigation occurs (ideally using `router.push`), the middleware, also using the Auth Helpers library (`createMiddlewareClient`), will be able to read the session cookie correctly, recognize the user as authenticated, and allow access to protected routes like `/dashboard/agents`, resolving the redirection loop.

## Mermaid Diagram of Final Plan

```mermaid
sequenceDiagram
    participant Browser
    participant LoginPage as app/(auth)/login/page.tsx
    participant AuthContext as contexts/auth-context.tsx
    participant NextRouter as next/navigation
    participant SupabaseClient as lib/supabase-client.ts (using createBrowserClient)
    participant ServerMiddleware as middleware.ts (using createMiddlewareClient)
    participant SupabaseServer as (implicitly used by middleware)
    participant DashboardPage as /dashboard/agents

    Browser->>LoginPage: User submits login form
    LoginPage->>AuthContext: calls login(email, password, '/dashboard/agents')
    AuthContext->>SupabaseClient: calls signInWithPassword()
    Note over SupabaseClient: Session stored in Cookie by createBrowserClient
    SupabaseClient-->>AuthContext: returns { data: { user, session }, error: null }
    AuthContext->>SupabaseClient: calls getUserFromSession(session)
    SupabaseClient-->>AuthContext: returns userProfile
    AuthContext->>AuthContext: Updates user & session state
    AuthContext->>NextRouter: calls router.push('/dashboard/agents') %% Using client-side nav
    NextRouter->>ServerMiddleware: Initiates client-side navigation
    ServerMiddleware->>SupabaseServer: calls getSession() (reads session Cookie)
    SupabaseServer-->>ServerMiddleware: returns session
    ServerMiddleware->>DashboardPage: Allows request (User is authenticated)
    DashboardPage-->>Browser: Renders dashboard page