"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import { MdArrowBack, MdSave, MdLock } from 'react-icons/md';

export default function EditLessonPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  // Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Mindset");
  const [tone, setTone] = useState("Realization");
  const [coverImage, setCoverImage] = useState("");
  const [quote, setQuote] = useState("");
  const [content, setContent] = useState("");
  const [closing, setClosing] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (session && params?.id) {
      fetch(`/api/lessons/${params.id}`)
        .then(res => {
          if (!res.ok) throw new Error("Lesson not found");
          return res.json();
        })
        .then(data => {
          // Confirm ownership
          if (data.userId !== session.user.id) {
            setError("You are not authorized to edit this lesson.");
            setLoading(false);
            return;
          }
          
          setTitle(data.title || "");
          setCategory(data.category || "Mindset");
          setTone(data.tone || "Realization");
          setCoverImage(data.coverImage || "");
          setQuote(data.quote || "");
          setContent(Array.isArray(data.content) ? data.content.join("\n\n") : data.content || "");
          setClosing(data.closing || "");
          setIsPremium(data.isPremium || false);
          setIsVisible(data.isVisible !== false);
          
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError("Failed to load lesson details.");
          setLoading(false);
        });
    }
  }, [params?.id, session]);

  useEffect(() => {
    if (!sessionPending && !session) {
      window.location.href = "/sign-in";
    }
  }, [session, sessionPending]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category) {
      alert("Title, content, and category are required.");
      return;
    }
    
    setSaving(true);
    try {
      const res = await fetch(`/api/lessons/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          tone,
          coverImage,
          quote,
          content,
          closing,
          isPremium,
          isVisible
        })
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard/my-lessons");
      } else {
        alert(data.error || "Failed to update lesson.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong saving the changes.");
    } finally {
      setSaving(false);
    }
  };

  if (sessionPending || !session || loading) {
    return (
      <div className="p-8 text-on-surface-variant font-sans text-center mt-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-sm text-text-body/60">Loading lesson details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center mt-20 max-w-md mx-auto">
        <h2 className="font-serif text-2xl font-bold text-error mb-4">Error</h2>
        <p className="text-on-surface-variant font-sans mb-8">{error}</p>
        <button onClick={() => router.back()} className="btn btn-outline flex items-center gap-2 mx-auto">
          <MdArrowBack /> Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-10 py-8 bg-background/80 backdrop-blur-md flex items-center gap-4 border-b border-white/5 mb-8">
        <button 
          onClick={() => router.back()} 
          className="btn btn-ghost btn-circle text-on-surface-variant hover:text-on-surface"
        >
          <MdArrowBack className="text-[20px]" />
        </button>
        <div>
          <h1 className="font-serif text-3xl font-semibold text-text-heading">Edit Lesson</h1>
          <p className="text-sm font-sans text-text-body mt-0.5">Refine your captured wisdom details below.</p>
        </div>
      </header>

      <section className="max-w-[800px] pb-24">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block font-mono uppercase tracking-widest text-[11px] mb-2 text-text-body">Lesson Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input input-bordered w-full bg-bg-card border-white/10 text-on-surface focus:outline-none"
              placeholder="e.g. The Architecture of Silence"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block font-mono uppercase tracking-widest text-[11px] mb-2 text-text-body">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select select-bordered w-full bg-bg-card border-white/10 text-on-surface focus:outline-none"
              >
                <option value="Mindset">Mindset</option>
                <option value="Career">Career</option>
                <option value="Relationships">Relationships</option>
                <option value="Productivity">Productivity</option>
                <option value="Stoicism">Stoicism</option>
                <option value="Health">Health</option>
              </select>
            </div>

            {/* Tone */}
            <div>
              <label className="block font-mono uppercase tracking-widest text-[11px] mb-2 text-text-body">Tone of Reflection</label>
              <input 
                type="text" 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="input input-bordered w-full bg-bg-card border-white/10 text-on-surface focus:outline-none"
                placeholder="e.g. Philosophical, Humorous, Practical"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block font-mono uppercase tracking-widest text-[11px] mb-2 text-text-body">Cover Image URL</label>
            <input 
              type="text" 
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="input input-bordered w-full bg-bg-card border-white/10 text-on-surface focus:outline-none"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          {/* Quote */}
          <div>
            <label className="block font-mono uppercase tracking-widest text-[11px] mb-2 text-text-body">Reflection Quote (Optional)</label>
            <input 
              type="text" 
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="input input-bordered w-full bg-bg-card border-white/10 text-on-surface focus:outline-none"
              placeholder="e.g. Meaning is not found; it is constructed."
            />
          </div>

          {/* Content Paragraphs */}
          <div>
            <label className="block font-mono uppercase tracking-widest text-[11px] mb-2 text-text-body">Reflection Paragraphs</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="textarea textarea-bordered w-full bg-bg-card border-white/10 text-on-surface focus:outline-none min-h-[250px] font-serif text-base leading-relaxed"
              placeholder="Type your paragraphs. Separate each paragraph by clicking enter twice (adding a blank line between paragraphs)."
            />
          </div>

          {/* Closing Thought */}
          <div>
            <label className="block font-mono uppercase tracking-widest text-[11px] mb-2 text-text-body">Closing Thought (Optional)</label>
            <input 
              type="text" 
              value={closing}
              onChange={(e) => setClosing(e.target.value)}
              className="input input-bordered w-full bg-bg-card border-white/10 text-on-surface focus:outline-none"
              placeholder="e.g. Go slowly into the morning."
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-4 bg-bg-card p-6 rounded-xl border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-on-surface block text-sm">Public Visibility</span>
                <span className="text-xs text-text-body/60 font-sans">If off, only you can see this lesson in your dashboard.</span>
              </div>
              <input 
                type="checkbox" 
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="toggle toggle-primary" 
              />
            </div>

            {session.user.isPremium ? (
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div>
                  <span className="font-semibold text-on-surface block text-sm">Premium Sanctuary Access</span>
                  <span className="text-xs text-text-body/60 font-sans">Limit access to subscribers of the Premium Sanctuary.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="toggle toggle-secondary" 
                />
              </div>
            ) : (
              <div className="flex items-center justify-between border-t border-white/5 pt-4 opacity-50">
                <div>
                  <span className="font-semibold text-on-surface flex items-center gap-1 text-sm">Premium Sanctuary Access <MdLock className="text-sm text-text-body/60" /></span>
                  <span className="text-xs text-text-body/60 font-sans">Upgrade to Premium to lock this lesson for subscriber-only access.</span>
                </div>
                <input 
                  type="checkbox" 
                  disabled 
                  checked={false}
                  className="toggle toggle-secondary cursor-not-allowed" 
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button 
              type="button" 
              onClick={() => router.push("/dashboard/my-lessons")}
              className="btn btn-outline border-white/10 hover:bg-white/5"
              disabled={saving}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <MdSave className="text-lg" />
              )}
              Save Changes
            </button>
          </div>

        </form>
      </section>
    </>
  );
}
