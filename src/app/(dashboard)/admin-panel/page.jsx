"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPanelPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/metrics')
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Error ${res.status}: Access Denied`);
        }
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || "Failed to load admin panel metrics.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-on-surface-variant font-sans">Loading admin panel...</div>;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-bg-card rounded-xl border border-white/5 font-sans my-12">
        <span className="material-symbols-outlined text-6xl text-error mb-4">lock</span>
        <h2 className="font-serif text-3xl font-semibold text-text-heading mb-2">Access Denied</h2>
        <p className="text-text-body max-w-md mb-6">{error}</p>
        <Link href="/" className="btn btn-primary">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="w-full mb-12">
        {/* Header */}
        <header className="flex justify-between items-end mb-12 border-b border-white/5 pb-8">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-text-heading">System Overview</h1>
            <p className="text-base font-sans text-text-body mt-2">Global metrics and content moderation headquarters.</p>
          </div>
          <div className="flex gap-4">
            <button className="btn btn-outline border-white/10 hover:border-white/20 text-on-surface">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Logs
            </button>
            <button className="btn btn-primary">
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Announcement
            </button>
          </div>
        </header>

        {/* 5 Metric Stat Cards */}
        <section className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <div className="bg-bg-card p-6 rounded-xl border border-white/5 flex flex-col justify-between">
            <span className="font-mono text-xs tracking-widest text-text-body uppercase">Total Users</span>
            <div className="mt-4">
              <h3 className="text-3xl font-bold font-sans text-on-surface">{data.totalUsers}</h3>
              <p className={`text-xs mt-1 flex items-center gap-1 font-mono uppercase ${data.usersGrowth >= 0 ? 'text-success' : 'text-error'}`}>
                <span className="material-symbols-outlined text-sm">{data.usersGrowth >= 0 ? 'trending_up' : 'trending_down'}</span> +{data.usersGrowth}%
              </p>
            </div>
          </div>
          <div className="bg-bg-card p-6 rounded-xl border border-white/5 flex flex-col justify-between">
            <span className="font-mono text-xs tracking-widest text-text-body uppercase">Lessons Published</span>
            <div className="mt-4">
              <h3 className="text-3xl font-bold font-sans text-on-surface">{data.lessonsPublished}</h3>
              <p className={`text-xs mt-1 flex items-center gap-1 font-mono uppercase ${data.lessonsGrowth >= 0 ? 'text-success' : 'text-error'}`}>
                <span className="material-symbols-outlined text-sm">{data.lessonsGrowth >= 0 ? 'trending_up' : 'trending_down'}</span> +{data.lessonsGrowth}%
              </p>
            </div>
          </div>
          <div className="bg-bg-card p-6 rounded-xl border border-white/5 flex flex-col justify-between">
            <span className="font-mono text-xs tracking-widest text-text-body uppercase">Total Revenue</span>
            <div className="mt-4">
              <h3 className="text-3xl font-bold font-sans text-on-surface">{data.totalRevenue}</h3>
              <p className={`text-xs mt-1 flex items-center gap-1 font-mono uppercase ${data.revenueGrowth >= 0 ? 'text-success' : 'text-error'}`}>
                <span className="material-symbols-outlined text-sm">{data.revenueGrowth >= 0 ? 'trending_up' : 'trending_down'}</span> +{data.revenueGrowth}%
              </p>
            </div>
          </div>
          <div className="bg-bg-card p-6 rounded-xl border border-white/5 flex flex-col justify-between">
            <span className="font-mono text-xs tracking-widest text-text-body uppercase">Active Now</span>
            <div className="mt-4">
              <h3 className="text-3xl font-bold font-sans text-on-surface">{data.activeNow}</h3>
              <p className="text-text-body text-xs mt-1 font-mono uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span> Live Pulse
              </p>
            </div>
          </div>
          <div className="bg-bg-card p-6 rounded-xl border border-white/5 border-l-4 border-l-danger/40 flex flex-col justify-between">
            <span className="font-mono text-xs tracking-widest text-danger uppercase">Reports Pending</span>
            <div className="mt-4">
              <h3 className="text-3xl font-bold font-sans text-on-surface">{data.reportsPending}</h3>
              <p className="text-danger text-xs mt-1 font-mono uppercase">Action Required</p>
            </div>
          </div>
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-bg-card p-8 rounded-xl border border-white/5 h-[400px] flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h4 className="font-serif text-2xl font-semibold">User Growth</h4>
              <select className="select select-sm select-ghost text-primary uppercase font-mono tracking-widest outline-none">
                <option className="bg-bg-card text-text-heading">Last 30 Days</option>
                <option className="bg-bg-card text-text-heading">Last Quarter</option>
              </select>
            </div>
            <div className="flex-1 flex items-end gap-2 relative">
              <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path className="opacity-80" d="M0 80 Q 20 70 40 50 T 80 40 T 100 10" fill="none" stroke="#ffc66b" strokeWidth="2"></path>
                <path className="opacity-10" d="M0 80 Q 20 70 40 50 T 80 40 T 100 10 V 100 H 0 Z" fill="url(#lineGradient)"></path>
                <defs>
                  <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ffc66b"></stop>
                    <stop offset="100%" stopColor="transparent"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-0 w-full flex justify-between font-mono text-[10px] uppercase text-text-body/40 px-2">
                <span>01 OCT</span><span>10 OCT</span><span>20 OCT</span><span>30 OCT</span>
              </div>
            </div>
          </div>
          <div className="bg-bg-card p-8 rounded-xl border border-white/5 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-serif text-2xl font-semibold">Lesson Growth</h4>
              <span className="font-mono text-xs tracking-widest uppercase text-text-body">By Category</span>
            </div>
            <div className="flex-1 flex items-end justify-between gap-4 px-4">
              {['Life', 'Career', 'Mind', 'Health', 'Wealth'].map((label, i) => (
                <div key={label} className="flex-1 bg-primary/20 rounded-t-sm relative group">
                  <div className={`bg-primary transition-all duration-500 w-full rounded-t-sm group-hover:brightness-125`} style={{ height: `${[40, 75, 55, 90, 35][i]}%` }}></div>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase whitespace-nowrap text-text-body">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Manage Lessons Table */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-3xl font-semibold">Manage Lessons</h2>
            <div className="flex gap-2">
              <div className="relative">
                <input className="input input-bordered bg-bg-card border-white/10 pl-10 w-64 text-on-surface focus:border-primary focus:outline-none" placeholder="Search lessons..." type="text" />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-body text-[18px]">search</span>
              </div>
            </div>
          </div>
          <div className="bg-bg-card rounded-xl border border-white/5 overflow-hidden">
            <table className="table w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-4 font-mono text-[11px] tracking-widest uppercase text-text-body">Title</th>
                  <th className="px-6 py-4 font-mono text-[11px] tracking-widest uppercase text-text-body">Creator</th>
                  <th className="px-6 py-4 font-mono text-[11px] tracking-widest uppercase text-text-body">Category</th>
                  <th className="px-6 py-4 font-mono text-[11px] tracking-widest uppercase text-text-body">Access</th>
                  <th className="px-6 py-4 font-mono text-[11px] tracking-widest uppercase text-text-body">Status</th>
                  <th className="px-6 py-4 font-mono text-[11px] tracking-widest uppercase text-text-body">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.lessons.map((lesson, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-sans text-base font-bold text-on-surface">{lesson.title}</td>
                    <td className="px-6 py-4 font-sans text-base text-text-body">{lesson.creator}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-mono border border-tertiary/20">{lesson.category}</span>
                    </td>
                    <td className="px-6 py-4 font-sans text-base text-text-body">{lesson.access}</td>
                    <td className="px-6 py-4">
                      <button className={`btn btn-xs rounded-full font-mono ${lesson.status === 'FEATURED' ? 'btn-primary bg-primary/10 text-primary border-primary/40 hover:bg-primary hover:text-on-primary-container' : 'btn-outline border-white/10 text-text-body hover:border-primary/40 hover:text-primary hover:bg-transparent'}`}>
                        {lesson.status}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button className="btn btn-ghost btn-sm btn-circle text-text-body hover:bg-white/10">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 bg-white/5 flex justify-between items-center font-mono text-[10px] uppercase text-text-body">
              <span>Showing 1-{data.lessons.length} of 2,401 lessons</span>
              <div className="join gap-1">
                <button className="join-item btn btn-ghost btn-xs font-mono uppercase">PREVIOUS</button>
                <button className="join-item btn btn-ghost btn-xs btn-active text-primary font-bold">1</button>
                <button className="join-item btn btn-ghost btn-xs">2</button>
                <button className="join-item btn btn-ghost btn-xs font-mono uppercase">NEXT</button>
              </div>
            </div>
          </div>
        </section>

        {/* Reported Lessons Table */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-serif text-3xl font-semibold">Reported Content</h2>
            <span className="bg-danger/20 text-danger px-3 py-1 rounded-full font-mono uppercase text-[10px] border border-danger/30">CRITICAL MODERATION</span>
          </div>
          <div className="bg-bg-card rounded-xl border border-danger/10 overflow-hidden">
            <table className="table w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-danger/5">
                  <th className="px-6 py-4 font-mono uppercase text-[11px] text-text-body">Lesson Title</th>
                  <th className="px-6 py-4 font-mono uppercase text-[11px] text-text-body">Report Count</th>
                  <th className="px-6 py-4 font-mono uppercase text-[11px] text-text-body">Latest Reason</th>
                  <th className="px-6 py-4 font-mono uppercase text-[11px] text-text-body">Severity</th>
                  <th className="px-6 py-4 font-mono uppercase text-[11px] text-text-body">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.reports.map((report, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-sans text-base font-bold text-on-surface">{report.title}</td>
                    <td className="px-6 py-4">
                      <span className="bg-danger text-on-error px-2 py-1 rounded text-xs font-bold">{report.count < 10 ? `0${report.count}` : report.count}</span>
                    </td>
                    <td className="px-6 py-4 font-sans text-base text-text-body italic">"{report.reason}"</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, idx) => (
                          <div key={idx} className={`w-4 h-1.5 rounded-full ${idx < report.severity ? 'bg-danger' : 'bg-white/10'}`}></div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="btn btn-outline btn-error btn-xs font-mono uppercase border-white/10 text-on-surface hover:text-on-error">VIEW REPORTS</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
