import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ShaderBackground from '@/components/shader-background/shader-background';

export default function Hero() {
  return (
    <header className="hero relative w-full min-h-[65vh] md:min-h-[600px] overflow-hidden border-b border-surface-tint/10">
      <div className="absolute inset-0 z-0">
        <ShaderBackground />
      </div>
      <div className="hero-overlay bg-gradient-to-b from-background/40 via-background/60 to-background z-0 absolute inset-0"></div>
      
      <div className="hero-content text-center relative z-10 px-4 pt-10 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight md:leading-[1.1] tracking-tight text-white mb-6 drop-shadow-sm">
            Preserve Your Wisdom.<br className="hidden sm:block" />
            <span className="text-primary">Inspire the World.</span>
          </h1>
          <p className="text-base md:text-xl font-sans text-on-surface-variant mb-10 max-w-2xl mx-auto leading-relaxed">
            A digital sanctuary for capturing the profound lessons of a life well-lived. Share your journey and help the next generation navigate theirs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/add-lesson" className="btn btn-primary btn-md md:btn-lg w-full sm:w-auto shadow-lg shadow-primary/20 transition-all hover:scale-105">
              Start Writing
            </Link>
            <Link href="/browse-wisdom" className="btn btn-outline btn-md md:btn-lg w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all hover:scale-105">
              Explore Wisdom
            </Link>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
