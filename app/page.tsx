"use client";

import { useState, useEffect } from "react";
import { Sparkles, Music, Headphones } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Vibrant gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_transparent_58%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-secondary/15" />
        <div className="absolute -left-32 top-6 h-[540px] w-[540px] rounded-full bg-brand-amber/40 blur-[170px]" />
        <div className="absolute -right-24 top-28 h-[440px] w-[440px] rounded-full bg-brand-cyan/40 blur-[150px]" />
        <div className="absolute bottom-6 left-1/4 h-[380px] w-[380px] rounded-full bg-brand-pink/30 blur-[140px]" />
        <div className="absolute -bottom-24 right-1/3 h-[340px] w-[340px] rounded-full bg-brand-blue/30 blur-[120px]" />
      </div>

      {/* Noise texture */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Nav */}
      <nav className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60 shadow-lg shadow-primary/20 backdrop-blur-xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/70 via-brand-amber/70 to-accent/70 opacity-70" />
            <Sparkles className="relative h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-foreground">
            aura.fm
          </span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-full border border-white/40 bg-white/40 px-5 py-2.5 text-sm font-semibold text-foreground backdrop-blur-xl transition-all hover:bg-white/60"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign In
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-full bg-gradient-to-r from-primary via-brand-amber to-accent px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/40"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* Floating icons */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[10%] top-[25%] animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/20 to-brand-cyan/20 backdrop-blur-sm">
              <Music className="h-6 w-6 text-secondary" />
            </div>
          </div>
          <div className="absolute right-[12%] top-[20%] animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm">
              <Headphones className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="absolute bottom-[30%] left-[8%] animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-brand-amber/20 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
          </div>
        </div>

        {/* Glass Card */}
        <div
          className="relative max-w-2xl"
          style={{
            animation: "float 6s ease-in-out infinite",
          }}
        >
          {/* Card glow */}
          <div className="absolute -inset-6 rounded-[2.8rem] bg-gradient-to-r from-primary/35 via-brand-amber/30 to-accent/35 blur-3xl" />

          {/* Main glass card */}
          <div className="relative rounded-[2.6rem] border border-white/40 bg-white/40 p-10 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.5)] backdrop-blur-2xl sm:p-14">
            {/* Inner glow */}
            <div className="pointer-events-none absolute inset-0 rounded-[2.6rem] bg-gradient-to-b from-white/70 via-white/10 to-transparent" />

            {/* Content */}
            <div className="relative flex flex-col items-center text-center">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-4 py-1.5 backdrop-blur-xl">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                <span className="text-sm font-semibold text-foreground">Discover your music personality</span>
              </div>

              <h1 className="mb-5 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                Discover Your
                <br />
                <span className="relative inline-block mt-1">
                  <span className="relative z-10 bg-gradient-to-r from-primary via-brand-amber to-accent bg-clip-text text-transparent">
                    Music Aura
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary via-brand-amber to-accent bg-clip-text text-transparent blur-xl opacity-50" />
                </span>
              </h1>

              <p className="mb-10 max-w-md text-pretty text-lg text-muted-foreground">
                Rate songs and reveal your vibe. Discover what makes your music taste unique.
              </p>

              {/* CTA Button */}
              <Link
                href={user ? "/rate" : "/auth/sign-up"}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative overflow-hidden rounded-full px-10 py-4 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/40"
              >
                {/* Button glow effect */}
                <div
                  className={`absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-brand-amber to-accent blur-xl transition-all duration-300 ${
                    isHovered ? "opacity-100 blur-2xl" : "opacity-70"
                  }`}
                />

                {/* Button background */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-brand-amber to-accent" />

                {/* Button shimmer */}
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-foreground/30 to-transparent transition-transform duration-700 ${
                    isHovered ? "translate-x-full" : "-translate-x-full"
                  }`}
                />

                {/* Button content */}
                <span className="relative flex items-center gap-2 text-primary-foreground">
                  <Sparkles
                    className={`h-5 w-5 transition-transform duration-300 ${isHovered ? "rotate-12 scale-110" : ""}`}
                  />
                  Check Your Aura
                </span>
              </Link>

              {/* Social proof */}
              <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-7 w-7 rounded-full border-2 border-background bg-gradient-to-br from-primary/50 to-secondary/50"
                    />
                  ))}
                </div>
                <span className="ml-1">Join 10k+ music lovers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative dots */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[20%] top-[15%] h-2 w-2 rounded-full bg-primary/60" />
          <div className="absolute right-[25%] top-[25%] h-1.5 w-1.5 rounded-full bg-secondary/60" />
          <div className="absolute bottom-[20%] left-[30%] h-1 w-1 rounded-full bg-accent/60" />
          <div className="absolute bottom-[30%] right-[20%] h-2 w-2 rounded-full bg-brand-cyan/60" />
        </div>
      </div>

      {/* Custom animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </main>
  );
}
