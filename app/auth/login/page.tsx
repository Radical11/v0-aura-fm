"use client";

import React from "react"

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0c0a14] p-6">
      {/* Vibrant background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1025] via-[#0f0d18] to-[#0a0d1a]" />
        <div className="absolute -left-20 top-20 h-[450px] w-[450px] rounded-full bg-orange-500/25 blur-[150px]" />
        <div className="absolute -right-20 bottom-20 h-[350px] w-[350px] rounded-full bg-blue-500/25 blur-[130px]" />
        <div className="absolute bottom-1/3 left-1/3 h-[300px] w-[300px] rounded-full bg-yellow-500/15 blur-[120px]" />
      </div>

      {/* Logo */}
      <Link
        href="/"
        className="absolute left-6 top-6 flex items-center gap-2 transition-opacity hover:opacity-80"
      >
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-400 shadow-lg shadow-orange-500/20">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-white">
          aura.fm
        </span>
      </Link>

      {/* Glass card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-orange-500/20 via-yellow-500/20 to-blue-500/20 blur-2xl" />
        <div className="relative rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-2xl">
          {/* Inner glow */}
          <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] bg-gradient-to-b from-white/5 to-transparent" />

          <div className="relative mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-white">
              Welcome back
            </h1>
            <p className="text-white/50">
              Sign in to continue your aura journey
            </p>
          </div>

          <form onSubmit={handleLogin} className="relative space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-orange-500/50 focus:ring-orange-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-orange-500/50 focus:ring-orange-500/20"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="relative w-full overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 py-6 text-lg font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(251,146,60,0.4)]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative mt-6 text-center text-sm text-white/50">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="font-medium text-orange-400 underline-offset-4 transition-colors hover:text-orange-300 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
