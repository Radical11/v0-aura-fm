import Link from "next/link";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-6">
      {/* Ambient background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-destructive/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/15 blur-[120px]" />
      </div>

      {/* Logo */}
      <Link
        href="/"
        className="absolute left-6 top-6 text-xl font-bold tracking-tight text-foreground"
      >
        aura<span className="text-primary">.fm</span>
      </Link>

      {/* Glass card */}
      <div className="relative z-10 w-full max-w-md text-center">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-destructive/30 to-primary/30 opacity-30 blur-xl" />
        <div className="relative rounded-2xl border border-border bg-card/60 p-8 shadow-2xl backdrop-blur-xl">
          {/* Error icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/20">
            <svg
              className="h-10 w-10 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="mb-3 text-2xl font-bold text-foreground">
            Something went wrong
          </h1>

          {params?.error ? (
            <p className="mb-6 text-muted-foreground">
              Error: {params.error}
            </p>
          ) : (
            <p className="mb-6 text-muted-foreground">
              An unexpected error occurred during authentication.
            </p>
          )}

          <div className="flex flex-col gap-3">
            <Link
              href="/auth/login"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-accent px-6 text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              Try again
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Go back home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
