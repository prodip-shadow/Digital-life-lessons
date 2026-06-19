import React from 'react';
import { motion } from 'framer-motion';

export default function Marquee() {
  const categories = ["Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
  const marqueeItems = [...categories, ...categories, ...categories];

  return (
    <section className="bg-surface-container-low border-y border-white/5 py-6 overflow-hidden relative">
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        className="flex gap-12 items-center w-max"
      >
        {marqueeItems.map((item, idx) => (
          <React.Fragment key={idx}>
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-[0.1em] whitespace-nowrap">
              {item}
            </span>
            <span className="text-primary">•</span>
          </React.Fragment>
        ))}
      </motion.div>
    </section>
  );
}
