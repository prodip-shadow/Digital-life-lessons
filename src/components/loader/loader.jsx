"use client";

import React from 'react';

export default function Loader({ message = "Loading reflections..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[300px] w-full">
      <div className="relative w-16 h-16">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
        {/* Inner spinning gold ring */}
        <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        {/* Secondary spinning violet ring (reverse) */}
        <div className="absolute inset-2 rounded-full border-4 border-b-secondary border-t-transparent border-r-transparent border-l-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}></div>
      </div>
      {message && (
        <p className="mt-6 font-sans text-sm tracking-wide text-text-body/60 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
