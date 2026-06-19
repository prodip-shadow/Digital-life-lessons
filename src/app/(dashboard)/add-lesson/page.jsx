"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MdLocalFireDepartment, 
  MdLightbulb, 
  MdVolunteerActivism, 
  MdWbCloudy, 
  MdStars, 
  MdCheckCircle, 
  MdSend 
} from 'react-icons/md';
import { authClient } from '@/lib/auth-client';

export default function AddLessonPage() {
  const { data: session } = authClient.useSession();
  const userIsPremium = session?.user?.isPremium === true;
  const [activeTone, setActiveTone] = useState('Motivational');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [todayCount, setTodayCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(true);

  useEffect(() => {
    if (session) {
      fetch("/api/lessons/today-count")
        .then(res => res.json())
        .then(data => {
          setTodayCount(data.count || 0);
          setLoadingCount(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingCount(false);
        });
    }
  }, [session]);

  const hasReachedLimit = !userIsPremium && todayCount >= 5;

  const tones = [
    { name: 'Motivational', icon: MdLocalFireDepartment },
    { name: 'Realization', icon: MdLightbulb },
    { name: 'Gratitude', icon: MdVolunteerActivism },
    { name: 'Sad', icon: MdWbCloudy }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPublishing(true);
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const content = formData.get("content");
    const category = formData.get("category");
    const coverImage = formData.get("coverImage");
    const isPremium = formData.get("isPremium") === "on";

    try {
      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          category,
          tone: activeTone,
          coverImage: coverImage || undefined,
          isPremium
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to publish lesson");
      }

      setIsPublished(true);
      setTimeout(() => {
        setIsPublished(false);
        window.location.href = "/dashboard";
      }, 2000);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error publishing lesson. Please verify that you are signed in.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-full py-16 px-4 md:px-12 flex flex-col items-center">
      {/* Content Header */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-text-heading mb-4">Share Your Wisdom</h1>
        <p className="text-text-body font-sans text-base">Every experience holds a seed of truth. Record your realization to inspire the community and preserve your personal growth journey.</p>
      </div>

      {/* Limit Banner */}
      {!loadingCount && hasReachedLimit && (
        <div className="w-full max-w-[680px] mb-6 p-5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center text-amber-400 font-sans text-sm flex flex-col items-center gap-3">
          <p className="font-semibold text-base">⚠️ Daily Limit Reached</p>
          <p className="opacity-90">Standard members can only publish up to 5 lessons per day. Upgrade to Premium for unlimited publishing, or wait until midnight Bangladesh time.</p>
          <Link href="/upgrade" className="btn btn-sm btn-primary font-bold px-6">
            Upgrade to Premium
          </Link>
        </div>
      )}

      {/* Add Lesson Form Card */}
      <div className="w-full max-w-[680px] bg-bg-card rounded-xl p-8 border border-white/5 relative">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Title Field */}
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">Lesson Title</label>
            <input name="title" className="input input-bordered w-full bg-transparent border-white/10 focus:border-primary text-2xl font-serif text-on-surface placeholder:text-on-surface-variant/30 py-4 h-auto" placeholder="What did life teach you?" type="text" required />
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">The Narrative</label>
            <textarea name="content" className="textarea textarea-bordered w-full h-48 bg-transparent border-white/10 focus:border-primary text-base font-sans text-on-surface placeholder:text-on-surface-variant/30 resize-none custom-scrollbar" placeholder="Describe the moment of impact and the wisdom gained..." required></textarea>
          </div>

          {/* Category & Tone Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">Category</label>
              <select name="category" className="select select-bordered w-full bg-[#1A1D28] border-white/10 focus:border-primary text-on-surface cursor-pointer">
                <option>Personal Growth</option>
                <option>Relationships</option>
                <option>Career & Ambition</option>
                <option>Spirituality</option>
                <option>Grief & Healing</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="font-mono text-xs uppercase tracking-widest text-on-surface-variant uppercase tracking-widest">Emotional Tone</label>
              <div className="flex flex-wrap gap-2">
                {tones.map(tone => {
                  const ToneIcon = tone.icon;
                  return (
                    <button 
                      key={tone.name}
                      type="button"
                      onClick={() => setActiveTone(tone.name)}
                      className={`btn btn-sm rounded-full font-medium flex items-center gap-1.5 ${
                        activeTone === tone.name 
                          ? 'btn-primary bg-primary-container/10 border-primary-container text-primary shadow-[0_0_15px_rgba(232,168,56,0.2)]' 
                          : 'btn-outline border-white/10 text-on-surface-variant hover:border-white/20 hover:bg-transparent'
                      }`}
                    >
                      <ToneIcon className="text-[18px]" /> {tone.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cover Imagery Input */}
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">Cover Image URL</label>
            <input 
              name="coverImage" 
              className="input input-bordered w-full bg-transparent border-white/10 focus:border-primary text-base font-sans text-on-surface placeholder:text-on-surface-variant/30 py-3" 
              placeholder="https://images.unsplash.com/photo-... (or leave blank for default)" 
              type="url" 
            />
          </div>

          {/* Toggles Section */}
          <div className="pt-4">
            <div className={`flex items-center justify-between p-4 bg-white/5 rounded-lg relative group ${!userIsPremium ? 'opacity-60' : ''}`}>
              <div>
                <p className="text-on-surface font-semibold flex items-center gap-2">
                  Premium Access
                  <MdStars className={`text-[16px] ${userIsPremium ? 'text-primary' : 'text-on-surface-variant'}`} />
                </p>
                <p className="text-xs text-on-surface-variant">
                  {userIsPremium 
                    ? 'Unlock for premium subscribers' 
                    : 'Only premium members can create premium lessons'}
                </p>
              </div>
              <input 
                type="checkbox" 
                name="isPremium" 
                disabled={!userIsPremium}
                className="toggle toggle-primary cursor-pointer disabled:opacity-50" 
              />
            </div>
          </div>

          {/* Submit CTA */}
          <button 
            type="submit"
            disabled={isPublishing || isPublished || hasReachedLimit || (session && loadingCount)}
            className={`btn btn-lg w-full h-14 text-lg font-bold flex items-center justify-center gap-2 ${
              isPublished 
                ? 'btn-success text-white' 
                : hasReachedLimit
                  ? 'btn-disabled opacity-50 bg-white/5 text-on-surface/40 border-white/5'
                  : 'btn-primary'
            }`}
          >
            {hasReachedLimit ? (
              'Daily Limit Reached (5/5)'
            ) : isPublished ? (
              <>
                <MdCheckCircle className="text-xl" /> Published Successfully
              </>
            ) : isPublishing ? (
              <>
                <span className="loading loading-spinner"></span> Publishing...
              </>
            ) : (
              <>
                Publish Lesson
                <MdSend className="text-xl" />
              </>
            )}
          </button>
          <p className="text-center text-xs text-on-surface-variant/40">By publishing, you agree to our Content Guidelines and Editorial Standards.</p>
        </form>
      </div>
    </div>
  );
}
