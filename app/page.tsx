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
    <main className="relative min-h-screen overflow-hidden bg-[#0c0a14]">
      {/* Vibrant gradient background */}
      <div className="pointer-events-none absolute inset-0">
        {/* Main gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1025] via-[#0f0d18] to-[#0a0d1a]" />
        
        {/* Vibrant orbs */}
        <div className="absolute -left-20 top-20 h-[500px] w-[500px] rounded-full bg-orange-500/25 blur-[150px]" />
        <div className="absolute -right-20 top-40 h-[400px] w-[400px] rounded-full bg-blue-500/30 blur-[130px]" />
        <div className="absolute bottom-20 left-1/4 h-[350px] w-[350px] rounded-full bg-yellow-500/20 blur-[120px]" />
        <div className="absolute -bottom-20 right-1/3 h-[300px] w-[300px] rounded-full bg-cyan-500/20 blur-[100px]" />
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
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-400 shadow-lg shadow-orange-500/25">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">
            aura.fm
          </span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-xl transition-all hover:bg-white/20"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-xl transition-all hover:bg-white/20"
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400/20 to-cyan-400/20 backdrop-blur-sm">
              <Music className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div className="absolute right-[12%] top-[20%] animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400/20 to-yellow-400/20 backdrop-blur-sm">
              <Headphones className="h-5 w-5 text-orange-400" />
            </div>
          </div>
          <div className="absolute bottom-[30%] left-[8%] animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400/20 to-amber-400/20 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-yellow-400" />
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
          <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-r from-orange-500/20 via-yellow-500/20 to-blue-500/20 blur-2xl" />

          {/* Main glass card */}
          <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.03] p-10 backdrop-blur-2xl sm:p-14">
            {/* Inner glow */}
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent" />

            {/* Content */}
            <div className="relative flex flex-col items-center text-center">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500/10 to-yellow-500/10 px-4 py-1.5 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
                <span className="text-sm font-medium text-orange-300">Discover your music personality</span>
              </div>

              <h1 className="mb-5 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Discover Your
                <br />
                <span className="relative inline-block mt-1">
                  <span className="relative z-10 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                    Music Aura
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent blur-xl opacity-50" />
                </span>
              </h1>

              <p className="mb-10 max-w-md text-pretty text-lg text-white/50">
                Rate songs and reveal your vibe. Discover what makes your music taste unique.
              </p>

              {/* CTA Button */}
              <Link
                href={user ? "/rate" : "/auth/sign-up"}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative overflow-hidden rounded-full px-10 py-4 font-semibold text-white transition-all duration-300"
              >
                {/* Button glow effect */}
                <div
                  className={`absolute -inset-1 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 blur-lg transition-all duration-300 ${
                    isHovered ? "opacity-100 blur-xl" : "opacity-60"
                  }`}
                />

                {/* Button background */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />

                {/* Button shimmer */}
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ${
                    isHovered ? "translate-x-full" : "-translate-x-full"
                  }`}
                />

                {/* Button content */}
                <span className="relative flex items-center gap-2 text-black">
                  <Sparkles
                    className={`h-5 w-5 transition-transform duration-300 ${isHovered ? "rotate-12 scale-110" : ""}`}
                  />
                  Check Your Aura
                </span>
              </Link>

              {/* Social proof */}
              <div className="mt-8 flex items-center gap-2 text-sm text-white/40">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-7 w-7 rounded-full border-2 border-[#0c0a14] bg-gradient-to-br from-orange-400/50 to-blue-400/50"
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
          <div className="absolute left-[20%] top-[15%] h-2 w-2 rounded-full bg-orange-400/60" />
          <div className="absolute right-[25%] top-[25%] h-1.5 w-1.5 rounded-full bg-blue-400/60" />
          <div className="absolute bottom-[20%] left-[30%] h-1 w-1 rounded-full bg-yellow-400/60" />
          <div className="absolute bottom-[30%] right-[20%] h-2 w-2 rounded-full bg-cyan-400/60" />
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
