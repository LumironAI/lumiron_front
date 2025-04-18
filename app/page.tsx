// Remove server-side redirects based on outdated cookie checks.
// Middleware now handles authentication redirects for the root path.

export default function Home() {
  // This page will likely never be reached directly by users due to middleware redirects.
  // Render minimal content or consider removing if not needed.
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Root Page</h1>
      <p>Middleware should handle redirects.</p>
    </main>
  );
}
