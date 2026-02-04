"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"

export default function Home() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0118] via-[#1a0a2e] to-[#0d1033]">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-600/20 blur-[128px]" />
        <div className="absolute -right-32 top-1/4 h-80 w-80 rounded-full bg-blue-600/20 blur-[128px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-500/15 blur-[100px]" />
        <div className="absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-indigo-500/20 blur-[120px]" />
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
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* Logo */}
        <div className="mb-12">
          <div className="flex items-center gap-2">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
              <Sparkles className="h-5 w-5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 opacity-60 blur-lg" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-white/90">
              aura.fm
            </span>
          </div>
        </div>

        {/* Glass Card */}
        <div 
          className="relative max-w-xl animate-[float_6s_ease-in-out_infinite]"
          style={{
            animation: 'float 6s ease-in-out infinite'
          }}
        >
          {/* Card glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-violet-500/30 opacity-75 blur-xl" />
          
          {/* Main glass card */}
          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-12 backdrop-blur-xl">
            {/* Inner border highlight */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/5" />
            
            {/* Content */}
            <div className="flex flex-col items-center text-center">
              <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Discover Your
                <span className="relative ml-3">
                  <span className="relative z-10 bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                    Music Aura
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent blur-lg" />
                </span>
              </h1>
              
              <p className="mb-10 max-w-md text-pretty text-lg text-white/60">
                Rate songs and reveal your vibe
              </p>

              {/* CTA Button */}
              <button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative overflow-hidden rounded-full px-8 py-4 font-medium text-white transition-all duration-300"
              >
                {/* Button glow effect */}
                <div 
                  className={`absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 opacity-75 blur-lg transition-all duration-300 ${
                    isHovered ? 'opacity-100 blur-xl' : ''
                  }`} 
                />
                
                {/* Button background */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600" />
                
                {/* Button shimmer */}
                <div 
                  className={`absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ${
                    isHovered ? 'translate-x-full' : '-translate-x-full'
                  }`}
                />
                
                {/* Button content */}
                <span className="relative flex items-center gap-2">
                  <Sparkles className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'rotate-12 scale-110' : ''}`} />
                  Check Your Aura
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[15%] top-[20%] h-2 w-2 animate-pulse rounded-full bg-purple-400/60" />
          <div className="absolute right-[20%] top-[30%] h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400/60" style={{ animationDelay: '1s' }} />
          <div className="absolute left-[25%] bottom-[25%] h-1 w-1 animate-pulse rounded-full bg-violet-400/60" style={{ animationDelay: '2s' }} />
          <div className="absolute right-[15%] bottom-[35%] h-2 w-2 animate-pulse rounded-full bg-indigo-400/60" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      {/* Custom animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </main>
  )
}
