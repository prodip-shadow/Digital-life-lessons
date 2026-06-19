"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authClient } from "@/lib/auth-client";
import { 
  MdEdit, 
  MdHistoryEdu, 
  MdTrendingUp, 
  MdTrendingDown, 
  MdVisibility, 
  MdForum, 
  MdFavorite, 
  MdMoreVert, 
  MdSearch, 
  MdFilterList, 
  MdDelete,
  MdPublic,
  MdVisibilityOff
} from 'react-icons/md';
import Loader from '@/components/loader/loader';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const fetchMetrics = () => {
    fetch('/api/dashboard/metrics')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Metrics load error:", err));
  };

  useEffect(() => {
    if (session) {
      fetchMetrics();
    }
  }, [session]);

  useEffect(() => {
    if (!sessionPending && !session) {
      window.location.href = "/sign-in";
    }
  }, [session, sessionPending]);

  const handleToggleVisibility = async (lessonId, currentVisible) => {
    try {
      const res = await fetch(`/api/lessons/${lessonId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !currentVisible })
      });
      if (res.ok) {
        setData(prev => ({
          ...prev,
          recentLessons: prev.recentLessons.map(l => l.id === lessonId ? { ...l, isVisible: !currentVisible } : l)
        }));
      } else {
        alert("Failed to toggle visibility.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    try {
      const res = await fetch(`/api/lessons/${lessonId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setData(prev => ({
          ...prev,
          recentLessons: prev.recentLessons.filter(l => l.id !== lessonId),
          totalLessons: prev.totalLessons - 1
        }));
      } else {
        alert("Failed to delete lesson.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (sessionPending || !session || !data) {
    return <Loader message="Loading dashboard..." />;
  }

  return (
    <>
      <header className="sticky top-0 z-10 py-8 bg-background/80 backdrop-blur-md flex justify-between items-end border-b border-white/5 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-text-heading">Welcome back, {session.user.name}</h1>
          <p className="text-base font-sans text-text-body mt-1">Here is what's happening with your reflections today.</p>
        </div>
        <Link href="/add-lesson" className="btn btn-primary">
          <MdEdit className="text-[18px]" />
          Write a Lesson
        </Link>
      </header>

      {/* Stats Grid */}
      <section className={`grid grid-cols-1 md:grid-cols-2 ${session?.user?.isPremium ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-6 mb-12`}>
        <div className="bg-bg-card p-6 rounded-xl border border-white/5 hover:border-white/15 transition-all">
          <div className="flex justify-between items-start mb-4">
            <MdHistoryEdu className="text-secondary text-2xl" />
          </div>
          <p className="font-mono text-xs tracking-widest text-text-body uppercase">Total Lessons</p>
          <h3 className="text-[32px] font-bold font-sans text-on-surface mt-1">{data.totalLessons}</h3>
        </div>

        <div className="bg-bg-card p-6 rounded-xl border border-white/5 hover:border-white/15 transition-all">
          <div className="flex justify-between items-start mb-4">
            <MdVisibility className="text-primary text-2xl" />
          </div>
          <p className="font-mono text-xs tracking-widest text-text-body uppercase">Total Views</p>
          <h3 className="text-[32px] font-bold font-sans text-on-surface mt-1">{data.totalViews}</h3>
        </div>

        <div className="bg-bg-card p-6 rounded-xl border border-white/5 hover:border-white/15 transition-all">
          <div className="flex justify-between items-start mb-4">
            <MdForum className="text-tertiary text-2xl" />
          </div>
          <p className="font-mono text-xs tracking-widest text-text-body uppercase">Discussions</p>
          <h3 className="text-[32px] font-bold font-sans text-on-surface mt-1">{data.discussions}</h3>
        </div>

        <div className="bg-bg-card p-6 rounded-xl border border-white/5 hover:border-white/15 transition-all">
          <div className="flex justify-between items-start mb-4">
            <MdFavorite className="text-success text-2xl" />
          </div>
          <p className="font-mono text-xs tracking-widest text-text-body uppercase">Total Likes</p>
          <h3 className="text-[32px] font-bold font-sans text-on-surface mt-1">{data.avgRating}</h3>
        </div>

        {session?.user?.isPremium && (
          <Link href="/dashboard/earnings-history" className="bg-bg-card p-6 rounded-xl border border-white/5 hover:border-[#FFD700]/30 hover:border-white/15 transition-all block">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[#FFD700] text-2xl font-bold font-serif">৳</span>
            </div>
            <p className="font-mono text-xs tracking-widest text-text-body uppercase">Total Earnings</p>
            <h3 className="text-[32px] font-bold font-sans text-on-surface mt-1">৳ {data.totalEarnings || 0}</h3>
          </Link>
        )}
      </section>

      {/* Main Dashboard View (Recent Lessons Table) */}
      <div className="pb-12 w-full">
        {/* Recent Lessons Table */}
        <div className="bg-bg-card rounded-xl border border-white/5 overflow-hidden flex flex-col w-full">
          <div className="p-8 flex justify-between items-center border-b border-white/5">
            <h2 className="font-serif text-[20px] font-semibold text-text-heading">Recent Lessons</h2>
          </div>
          <div className="overflow-x-auto flex-grow">
            {data.recentLessons.length > 0 ? (
              <table className="table w-full text-left">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-8 py-4 font-mono text-[11px] text-text-body/50 tracking-wider">TITLE</th>
                    <th className="px-8 py-4 font-mono text-[11px] text-text-body/50 tracking-wider">CATEGORY</th>
                    <th className="px-8 py-4 font-mono text-[11px] text-text-body/50 tracking-wider">ACCESS</th>
                    <th className="px-8 py-4 font-mono text-[11px] text-text-body/50 tracking-wider">VISIBILITY</th>
                    <th className="px-8 py-4 font-mono text-[11px] text-text-body/50 tracking-wider">CREATED</th>
                    <th className="px-8 py-4 font-mono text-[11px] text-text-body/50 tracking-wider text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.recentLessons.map((lesson) => (
                    <tr key={lesson.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex flex-col">
                          <Link href={`/browse-wisdom/${lesson.id}`} className="font-medium font-sans text-on-surface hover:text-primary transition-colors block truncate max-w-[200px]">
                            {lesson.title}
                          </Link>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="px-2 py-1 bg-secondary-container/10 text-secondary-fixed-dim text-[11px] font-mono rounded border border-secondary-container/30">
                          {lesson.category}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <span className="flex items-center gap-1.5 text-xs font-sans text-on-surface">
                          <span className={`w-2 h-2 rounded-full ${lesson.isPremium ? 'bg-primary-container' : 'bg-white/20'}`}></span>
                          {lesson.isPremium ? 'Premium' : 'Free'}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={lesson.isVisible} 
                            onChange={() => handleToggleVisibility(lesson.id, lesson.isVisible)}
                            className="toggle toggle-primary toggle-sm cursor-pointer" 
                          />
                          <span className="text-[10px] text-text-body/60 font-sans">
                            {lesson.isVisible ? (
                              <span className="flex items-center gap-0.5 text-primary"><MdPublic /> Public</span>
                            ) : (
                              <span className="flex items-center gap-0.5 text-on-surface-variant"><MdVisibilityOff /> Private</span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-xs font-sans text-text-body">{lesson.createdAt}</td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Link href={`/dashboard/edit-lesson/${lesson.id}`} className="btn btn-ghost btn-sm text-text-body/40 hover:text-primary cursor-pointer">
                            <MdEdit className="text-[20px]" />
                          </Link>
                          <button onClick={() => handleDeleteLesson(lesson.id)} className="btn btn-ghost btn-sm text-text-body/40 hover:text-error cursor-pointer">
                            <MdDelete className="text-[20px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-on-surface-variant/50 font-sans italic text-sm">
                No recent reflections created yet.
              </div>
            )}
          </div>
          <div className="p-4 bg-white/5 flex justify-center mt-auto">
            <Link href="/dashboard/my-lessons" className="btn btn-link btn-sm font-mono tracking-widest text-primary hover:text-on-surface no-underline hover:underline">
              VIEW ALL LESSONS
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
