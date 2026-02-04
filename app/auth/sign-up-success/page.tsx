import Link from "next/link";

export default function SignUpSuccessPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-6">
      {/* Ambient background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-[120px]" />
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
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/50 via-accent/50 to-secondary/50 opacity-30 blur-xl" />
        <div className="relative rounded-2xl border border-border bg-card/60 p-8 shadow-2xl backdrop-blur-xl">
          {/* Success icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-primary/20 to-accent/20">
            <svg
              className="h-10 w-10 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="mb-3 text-2xl font-bold text-foreground">
            Check your email
          </h1>
          <p className="mb-6 text-muted-foreground">
            We&apos;ve sent you a confirmation link. Please check your inbox and
            click the link to activate your account.
          </p>

          <div className="rounded-lg border border-border bg-background/30 p-4">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <Link
                href="/auth/sign-up"
                className="font-medium text-primary hover:text-accent"
              >
                try again
              </Link>
            </p>
          </div>

          <Link
            href="/auth/login"
            className="mt-6 inline-block text-sm font-medium text-primary hover:text-accent"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
