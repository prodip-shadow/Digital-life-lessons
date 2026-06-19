"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authClient } from "@/lib/auth-client";
import { 
  MdArrowBack,
  MdAnalytics,
  MdInfoOutline,
  MdOpenInNew,
  MdTrendingUp
} from 'react-icons/md';
import Loader from '@/components/loader/loader';

export default function EarningsHistoryPage() {
  const [earnings, setEarnings] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const { data: session, isPending: sessionPending } = authClient.useSession();

  useEffect(() => {
    if (session) {
      fetch(`/api/users/${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.user && Array.isArray(data.user.earningsHistory)) {
            // Sort by date descending (newest first)
            const sortedHistory = [...data.user.earningsHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
            setEarnings(sortedHistory);
            
            // Calculate sum
            const sum = sortedHistory.reduce((acc, curr) => acc + (curr.amount || 0), 0);
            setTotalEarnings(sum);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load user profile for earnings:", err);
          setLoading(false);
        });
    }
  }, [session]);

  useEffect(() => {
    if (!sessionPending) {
      if (!session) {
        window.location.href = "/sign-in";
      } else if (!session.user.isPremium) {
        window.location.href = "/dashboard";
      }
    }
  }, [session, sessionPending]);

  if (sessionPending || !session || loading) {
    return <Loader message="Loading earnings history..." />;
  }

  return (
    <>
      {/* Page Header */}
      <header className="sticky top-0 z-10 py-8 bg-background/80 backdrop-blur-md flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard" className="btn btn-ghost btn-xs gap-1 font-sans text-text-body/60 hover:text-primary pl-0">
              <MdArrowBack /> Back to Dashboard
            </Link>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-text-heading">Earnings History</h1>
          <p className="text-base font-sans text-text-body mt-1">Detailed log of rewards earned from premium readers of your reflections.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/add-lesson" className="btn btn-primary btn-sm md:btn-md font-sans">
            Write a Lesson
          </Link>
        </div>
      </header>

      {/* Stats Summary Panel */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Total Earnings Card */}
        <div className="bg-bg-card p-6 rounded-xl border border-white/5 relative overflow-hidden group hover:border-[#FFD700]/30 transition-all duration-300">
          <div className="absolute right-0 top-0 -mt-4 -mr-4 w-24 h-24 bg-[#FFD700]/5 rounded-full blur-xl group-hover:bg-[#FFD700]/10 transition-all duration-300"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#FFD700] text-3xl font-bold font-serif">৳</span>
            <span className="text-[10px] font-mono bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 px-2 py-0.5 rounded-full uppercase tracking-wider">Premium BDT</span>
          </div>
          <p className="font-mono text-xs tracking-widest text-text-body/60 uppercase">Total Balance Earned</p>
          <h3 className="text-[36px] font-bold font-sans text-on-surface mt-1 flex items-baseline gap-1">
            <span className="text-2xl text-[#FFD700]">৳</span> {totalEarnings}
          </h3>
        </div>

        {/* Premium Reads Card */}
        <div className="bg-bg-card p-6 rounded-xl border border-white/5 relative overflow-hidden group hover:border-secondary/30 transition-all duration-300">
          <div className="absolute right-0 top-0 -mt-4 -mr-4 w-24 h-24 bg-secondary/5 rounded-full blur-xl group-hover:bg-secondary/10 transition-all duration-300"></div>
          <div className="flex justify-between items-start mb-4">
            <MdAnalytics className="text-secondary text-2xl" />
            <span className="text-[10px] font-mono bg-secondary/10 text-secondary border border-secondary/30 px-2 py-0.5 rounded-full uppercase tracking-wider">Views Checked</span>
          </div>
          <p className="font-mono text-xs tracking-widest text-text-body/60 uppercase">Premium Reads</p>
          <h3 className="text-[36px] font-bold font-sans text-on-surface mt-1 flex items-baseline gap-1">
            {earnings.length} <span className="text-xs text-text-body/40 font-normal font-sans">times</span>
          </h3>
        </div>

        {/* Info Card / Rule Explanation */}
        <div className="bg-bg-card p-6 rounded-xl border border-white/5 flex flex-col justify-between hover:border-primary/20 transition-all">
          <div className="flex gap-3">
            <MdInfoOutline className="text-primary text-xl shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif text-sm font-semibold text-text-heading">Earning Rules</h4>
              <p className="text-xs text-text-body/70 mt-1 font-sans leading-relaxed">
                When a logged-in Premium user reads your Premium lesson for the **first time**, you earn **৳ 50**. Subsequent reads by the same user do not trigger rewards.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-text-body/50">
            <span>Minimum Payout Limit: None</span>
            <span className="flex items-center gap-0.5 text-primary"><MdTrendingUp /> Premium Plan Only</span>
          </div>
        </div>
      </section>

      {/* Earnings Logs Table */}
      <section className="flex-1 w-full pb-20">
        <div className="bg-bg-card rounded-xl border border-white/5 overflow-hidden flex flex-col w-full">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="font-serif text-lg font-semibold text-text-heading">Transaction History</h2>
            <span className="text-xs font-mono text-text-body/50">Showing all records ({earnings.length})</span>
          </div>

          <div className="overflow-x-auto">
            {earnings.length > 0 ? (
              <table className="table w-full text-left">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 font-mono text-[11px] text-text-body/50 tracking-wider">DATE & TIME</th>
                    <th className="px-6 py-4 font-mono text-[11px] text-text-body/50 tracking-wider">REFLECTION (LESSON)</th>
                    <th className="px-6 py-4 font-mono text-[11px] text-text-body/50 tracking-wider">PREMIUM READER</th>
                    <th className="px-6 py-4 font-mono text-[11px] text-text-body/50 tracking-wider text-right">AMOUNT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {earnings.map((earning, idx) => {
                    const localDate = new Date(earning.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                    const localTime = new Date(earning.date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    
                    return (
                      <tr key={earning._id || idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col font-sans">
                            <span className="text-sm text-on-surface font-medium">{localDate}</span>
                            <span className="text-xs text-text-body/40">{localTime}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-[300px]">
                          {earning.lessonId ? (
                            <Link 
                              href={`/browse-wisdom/${earning.lessonId}`} 
                              className="font-medium font-sans text-on-surface hover:text-primary transition-colors flex items-center gap-1.5 group truncate"
                            >
                              {earning.lessonTitle || "Untitled Reflection"}
                              <MdOpenInNew className="text-[12px] opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                            </Link>
                          ) : (
                            <span className="font-sans text-text-body/60">{earning.lessonTitle || "Untitled Reflection"}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-sans text-text-body">
                          <span className="font-semibold text-text-heading">{earning.readerName || "Anonymous Reader"}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="px-2.5 py-1 rounded bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 font-mono text-sm font-bold">
                            + ৳ {earning.amount || 50}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-20 max-w-md mx-auto">
                <div className="w-16 h-16 bg-[#FFD700]/5 rounded-full border border-[#FFD700]/10 flex items-center justify-center text-2xl mx-auto mb-6">
                  ৳
                </div>
                <h3 className="font-serif text-xl font-semibold text-text-heading mb-2">No Earnings Yet</h3>
                <p className="font-sans text-sm text-text-body/60 px-6 mb-8">
                  Write premium lessons and reflections. When other premium users read them, rewards will be logged here.
                </p>
                <Link href="/add-lesson" className="btn btn-primary">
                  Write Your First Premium Lesson
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
