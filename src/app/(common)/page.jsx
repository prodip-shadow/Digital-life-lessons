"use client";

import React from 'react';
import Hero from '@/components/homepage/hero';
import Marquee from '@/components/homepage/marquee';
import FeaturedLessons from '@/components/homepage/featured-lessons';
import Pillars from '@/components/homepage/pillars';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedLessons />
      <Pillars />
    </>
  );
}
