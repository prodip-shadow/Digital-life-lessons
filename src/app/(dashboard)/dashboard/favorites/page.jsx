"use client";

import React, { useState, useEffect } from 'react';
import { authClient } from "@/lib/auth-client";
import Card from '@/components/card/card';
import { MdFavorite, MdSearch } from 'react-icons/md';
import Link from 'next/link';
import Loader from '@/components/loader/loader';

export default function DashboardFavoritesPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, isPending: sessionPending } = authClient.useSession();

  useEffect(() => {
    if (session) {
      fetch('/api/dashboard/favorites')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setLessons(data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch favorites:", err);
          setLoading(false);
        });
    }
  }, [session]);

  useEffect(() => {
    if (!sessionPending && !session) {
      window.location.href = "/sign-in";
    }
  }, [session, sessionPending]);

  if (sessionPending || !session || loading) {
    return <Loader message="Loading your favorites..." />;
  }

  return (
    <>
      <header className="sticky top-0 z-10 py-8 bg-background/80 backdrop-blur-md flex justify-between items-end border-b border-white/5 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-text-heading flex items-center gap-2">
            <MdFavorite className="text-secondary" /> Favorited Lessons
          </h1>
          <p className="text-base font-sans text-text-body mt-1">A collection of wisdom reflections you've saved.</p>
        </div>
      </header>

      <section className="flex-1 w-full pb-12">
        {lessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <Card key={lesson._id} {...lesson} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-bg-card rounded-2xl border border-white/5 max-w-md mx-auto mt-10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-secondary text-3xl mx-auto mb-6">
              <MdFavorite />
            </div>
            <h3 className="font-serif text-xl font-semibold text-text-heading mb-2">No Favorites Yet</h3>
            <p className="font-sans text-sm text-text-body/60 px-6 mb-8">
              Explore shared reflections and click "Save to Favorites" to build your custom collection of wisdom.
            </p>
            <Link href="/browse-wisdom" className="btn btn-primary">
              Browse Lessons
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
