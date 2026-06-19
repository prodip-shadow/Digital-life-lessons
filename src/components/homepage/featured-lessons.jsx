"use client";

import React, { useEffect, useState } from 'react';
import Card from '@/components/card/card';
import Link from 'next/link';
export default function FeaturedLessons() {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetch('/api/lessons?limit=3')
      .then(res => res.json())
      .then(data => setLessons(data))
      .catch(err => console.error("Failed to fetch featured lessons", err));
  }, []);

  return (
    <section className="py-24 w-full">
      <div className="px-4 md:px-8 lg:px-12 xl:px-24 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-text-heading mb-2">Featured Insights</h2>
            <p className="text-text-body font-sans">The most impactful stories shared this week.</p>
          </div>
          <Link className="text-primary hover:underline font-sans text-sm font-medium" href="/browse-wisdom">View All Lessons</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson, idx) => (
            <Card key={idx} {...lesson} />
          ))}
        </div>
      </div>
    </section>
  );
}
