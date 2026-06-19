"use client";

import React, { useState, useEffect } from 'react';
import { authClient } from "@/lib/auth-client";
import { 
  MdEdit, 
  MdDelete, 
  MdVisibility, 
  MdVisibilityOff, 
  MdAdd, 
  MdFavorite, 
  MdLock,
  MdPublic,
  MdHistoryEdu
} from 'react-icons/md';
import Link from 'next/link';
import Loader from '@/components/loader/loader';

export default function MyLessonsDashboardPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, isPending: sessionPending } = authClient.useSession();

  useEffect(() => {
    if (session) {
      fetch(`/api/users/${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data.lessons)) {
            setLessons(data.lessons);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load user lessons:", err);
          setLoading(false);
        });
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
        setLessons(lessons.map(l => l._id === lessonId ? { ...l, isVisible: !currentVisible } : l));
      } else {
        alert("Failed to update visibility.");
      }
    } catch (err) {
      console.error("Toggle visibility error:", err);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm("Are you sure you want to delete this lesson? This action will permanently remove this reflection and all associated comments.")) return;
    try {
      const res = await fetch(`/api/lessons/${lessonId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setLessons(lessons.filter(l => l._id !== lessonId));
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to delete lesson.");
      }
    } catch (err) {
      console.error("Delete lesson error:", err);
    }
  };

  if (sessionPending || !session || loading) {
    return <Loader message="Loading your reflections..." />;
  }

  return (
    <>
      <header className="sticky top-0 z-10 py-8 bg-background/80 backdrop-blur-md flex justify-between items-end border-b border-white/5 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-text-heading">My Lessons</h1>
          <p className="text-base font-sans text-text-body mt-1">Manage, edit, or adjust visibility of your published reflections.</p>
        </div>
        <Link href="/add-lesson" className="btn btn-primary">
          <MdAdd className="text-[18px]" />
          Write a Lesson
        </Link>
      </header>

      <section className="flex-1 w-full pb-20">
        {lessons.length > 0 ? (
          <div className="bg-bg-card rounded-xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full text-left">
                <thead className="bg-white/5 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-mono text-[11px] text-text-body/50 tracking-wider">LESSON DETAILS</th>
                    <th className="px-6 py-4 font-mono text-[11px] text-text-body/50 tracking-wider">CATEGORY</th>
                    <th className="px-6 py-4 font-mono text-[11px] text-text-body/50 tracking-wider">ACCESS</th>
                    <th className="px-6 py-4 font-mono text-[11px] text-text-body/50 tracking-wider">VISIBILITY</th>
                    <th className="px-6 py-4 font-mono text-[11px] text-text-body/50 tracking-wider">WHO LIKED</th>
                    <th className="px-6 py-4 font-mono text-[11px] text-text-body/50 tracking-wider text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {lessons.map((lesson) => (
                    <tr key={lesson._id} className="hover:bg-white/5 transition-colors">
                      {/* Lesson title */}
                      <td className="px-6 py-4 max-w-[280px]">
                        <div className="flex flex-col">
                          <Link href={`/browse-wisdom/${lesson._id}`} className="font-medium font-sans text-on-surface hover:text-primary transition-colors truncate block">
                            {lesson.title}
                          </Link>
                          <span className="text-xs font-sans text-text-body/40">Created {new Date(lesson.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-secondary-container/10 text-secondary-fixed-dim text-[11px] font-mono rounded border border-secondary-container/30">
                          {lesson.category}
                        </span>
                      </td>

                      {/* Access type */}
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-xs font-sans text-on-surface">
                          {lesson.isPremium ? (
                            <>
                              <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                              <span>Premium</span>
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 rounded-full bg-white/20"></span>
                              <span>Free</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Visibility on/off switch */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={lesson.isVisible !== false}
                            onChange={() => handleToggleVisibility(lesson._id, lesson.isVisible !== false)}
                            className="toggle toggle-primary toggle-sm cursor-pointer" 
                          />
                          <span className="text-xs text-text-body/60">
                            {lesson.isVisible !== false ? (
                              <span className="flex items-center gap-1 text-primary"><MdPublic /> Public</span>
                            ) : (
                              <span className="flex items-center gap-1 text-on-surface-variant"><MdVisibilityOff /> Private</span>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Who liked the lesson */}
                      <td className="px-6 py-4">
                        {lesson.likedByUserProfiles && lesson.likedByUserProfiles.length > 0 ? (
                          <div className="flex -space-x-2 overflow-hidden hover:overflow-visible py-1">
                            {lesson.likedByUserProfiles.map((user) => (
                              <Link 
                                key={user.id} 
                                href={`/profile/${user.id}`}
                                className="avatar w-8 h-8 rounded-full border border-background hover:scale-110 transition-transform relative group tooltip"
                                data-tip={user.name}
                              >
                                <img 
                                  className="w-full h-full object-cover rounded-full" 
                                  alt={user.name} 
                                  src={user.image} 
                                  title={user.name}
                                />
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-text-body/30 italic">No likes yet</span>
                        )}
                      </td>

                      {/* Actions (Edit and Delete) */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link 
                            href={`/dashboard/edit-lesson/${lesson._id}`} 
                            className="btn btn-ghost btn-square btn-sm text-text-body/40 hover:text-primary cursor-pointer"
                            title="Edit Lesson"
                          >
                            <MdEdit className="text-[20px]" />
                          </Link>
                          <button 
                            onClick={() => handleDeleteLesson(lesson._id)} 
                            className="btn btn-ghost btn-square btn-sm text-text-body/40 hover:text-error cursor-pointer"
                            title="Delete Lesson"
                          >
                            <MdDelete className="text-[20px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-bg-card rounded-2xl border border-white/5 max-w-md mx-auto mt-10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-text-body/30 mx-auto mb-6">
              <MdHistoryEdu className="text-3xl" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-text-heading mb-2">No Lessons Created</h3>
            <p className="font-sans text-sm text-text-body/60 px-6 mb-8">
              Capture your digital life lessons, reflect, and share your wisdom with the world.
            </p>
            <Link href="/add-lesson" className="btn btn-primary">
              Write Your First Lesson
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
