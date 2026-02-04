'use client';

import { Sparkles, Moon, Music, ChevronRight, Share2 } from "lucide-react"
import Link from "next/link"

export default function ResultsPage() {
  const songsRated = 20
  const auraType = "Chill"

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0118] via-[#1a0a2e] to-[#0d1033]">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-600/20 blur-[128px]" />
        <div className="absolute -right-32 top-1/4 h-80 w-80 rounded-full bg-blue-600/20 blur-[128px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-500/15 blur-[100px]" />
        <div className="absolute right-1/4 top-1/2 h-64 w-64 rounded-full bg-indigo-500/20 blur-[100px]" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* Logo */}
        <div className="absolute left-4 top-6 sm:left-8">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
              <Sparkles className="h-4 w-4 text-white" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 opacity-60 blur-md" />
            </div>
            <span className="text-base font-semibold tracking-tight text-white/90">
              aura.fm
            </span>
          </Link>
        </div>

        {/* Main Glass Card */}
        <div className="relative w-full max-w-md">
          {/* Animated glow ring */}
          <div 
            className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-violet-500/30 blur-3xl"
            style={{
              animation: 'glow-pulse 4s ease-in-out infinite'
            }}
          />
          
          {/* Secondary glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/20 via-transparent to-blue-500/20 blur-xl" />
          
          {/* Main glass card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10">
            {/* Inner highlight */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/5" />
            
            {/* Shimmer effect */}
            <div 
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              style={{
                animation: 'shimmer 8s ease-in-out infinite',
                transform: 'translateX(-100%)'
              }}
            />
            
            {/* Content */}
            <div className="relative flex flex-col items-center text-center">
              {/* Aura Icon */}
              <div className="relative mb-6">
                {/* Icon glow */}
                <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-purple-500/40 to-blue-500/40 blur-2xl" />
                
                {/* Icon container */}
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm sm:h-28 sm:w-28">
                  <Moon className="h-12 w-12 text-purple-300 sm:h-14 sm:w-14" />
                  
                  {/* Animated ring */}
                  <div 
                    className="absolute -inset-1 rounded-full border-2 border-purple-500/30"
                    style={{
                      animation: 'spin-slow 20s linear infinite'
                    }}
                  />
                  <div 
                    className="absolute -inset-3 rounded-full border border-blue-500/20"
                    style={{
                      animation: 'spin-slow 30s linear infinite reverse'
                    }}
                  />
                </div>
              </div>

              {/* Main Title */}
              <div className="mb-4">
                <p className="mb-2 text-sm font-medium uppercase tracking-widest text-white/40">
                  Your Aura
                </p>
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  <span className="bg-gradient-to-r from-purple-300 via-violet-300 to-blue-300 bg-clip-text text-transparent">
                    {auraType}
                  </span>
                  <span className="ml-2">
                    <Moon className="inline-block h-8 w-8 text-purple-300 sm:h-10 sm:w-10" />
                  </span>
                </h1>
              </div>

              {/* Description */}
              <p className="mb-8 max-w-xs text-sm leading-relaxed text-white/50 sm:text-base">
                You vibe with laid-back beats, dreamy melodies, and late-night soundscapes. 
                Your music taste is effortlessly cool and introspective.
              </p>

              {/* Stats */}
              <div className="mb-8 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-sm">
                <Music className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-white/70">
                  <span className="font-semibold text-white">{songsRated}</span> songs rated
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex w-full flex-col gap-3">
                {/* Primary Button - View Leaderboard */}
                <Link 
                  href="/leaderboard"
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-full px-8 py-4 transition-all duration-300"
                >
                  {/* Button gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 transition-all duration-300 group-hover:from-purple-500 group-hover:via-violet-500 group-hover:to-blue-500" />
                  
                  {/* Glow effect */}
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-60" />
                  
                  {/* Shimmer */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      animation: 'button-shimmer 2s ease-in-out infinite'
                    }}
                  />
                  
                  {/* Button content */}
                  <span className="relative flex items-center gap-2 text-sm font-semibold text-white sm:text-base">
                    View Leaderboard
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>

                {/* Secondary Button - Share */}
                <button
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 px-8 py-3.5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                >
                  <span className="relative flex items-center gap-2 text-sm font-medium text-white/70 transition-colors duration-300 group-hover:text-white">
                    <Share2 className="h-4 w-4" />
                    Share Your Aura
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-[20%] h-2 w-2 animate-pulse rounded-full bg-purple-400/60" />
          <div className="absolute right-[12%] top-[15%] h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400/60" style={{ animationDelay: '1s' }} />
          <div className="absolute left-[15%] bottom-[25%] h-1 w-1 animate-pulse rounded-full bg-violet-400/60" style={{ animationDelay: '2s' }} />
          <div className="absolute right-[8%] bottom-[20%] h-2 w-2 animate-pulse rounded-full bg-indigo-400/60" style={{ animationDelay: '0.5s' }} />
          <div className="absolute left-[25%] top-[40%] h-1.5 w-1.5 animate-pulse rounded-full bg-pink-400/40" style={{ animationDelay: '1.5s' }} />
          <div className="absolute right-[20%] top-[60%] h-1 w-1 animate-pulse rounded-full bg-cyan-400/40" style={{ animationDelay: '2.5s' }} />
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes button-shimmer {
          0% {
            transform: translateX(-100%);
          }
          50%, 100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </main>
  )
}
