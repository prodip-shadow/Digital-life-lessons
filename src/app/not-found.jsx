"use client";

import React from 'react';
import Link from 'next/link';
import { MdHome, MdExplore } from 'react-icons/md';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#111318] text-[#e2e2e9] px-6 text-center relative overflow-hidden font-sans">
      {/* Background ambient gold/violet glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Centered Glassmorphic Container */}
      <div className="relative max-w-lg w-full bg-[#1A1D28]/40 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-2xl shadow-2xl space-y-6 z-10">
        {/* Large Golden 404 Number */}
        <h1 className="font-serif text-7xl md:text-8xl font-bold bg-gradient-to-r from-[#ffc66b] via-[#ffe3a8] to-[#c6c0ff] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,198,107,0.3)] animate-pulse">
          404
        </h1>

        {/* Heading */}
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white">
          Lost in the Sanctuary?
        </h2>

        {/* Description */}
        <p className="text-sm md:text-base text-text-body/70 leading-relaxed max-w-md mx-auto">
          The reflection or path you are looking for has either faded into silence or never existed in this digital sanctuary.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/" className="btn btn-primary w-full sm:w-auto font-sans flex items-center justify-center gap-2">
            <MdHome className="text-lg" />
            Go Home
          </Link>
          <Link href="/browse-wisdom" className="btn btn-outline border-white/10 text-on-surface hover:bg-white/5 w-full sm:w-auto font-sans flex items-center justify-center gap-2">
            <MdExplore className="text-lg" />
            Browse Lessons
          </Link>
        </div>
      </div>
    </div>
  );
}
