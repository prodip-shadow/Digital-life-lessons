"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MdArrowBack, 
  MdEdit, 
  MdSchool, 
  MdCake, 
  MdFavorite, 
  MdHistoryEdu, 
  MdEmail,
  MdCheck,
  MdClose
} from 'react-icons/md';
import { FaCrown } from 'react-icons/fa';
import { authClient } from '@/lib/auth-client';
import Card from '@/components/card/card';
import Loader from '@/components/loader/loader';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  
  const [profile, setProfile] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Edit Profile mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStudyAt, setEditStudyAt] = useState("");
  const [editDateOfBirth, setEditDateOfBirth] = useState("");
  const [editImage, setEditImage] = useState("");
  const [updating, setUpdating] = useState(false);

  const isOwner = session?.user?.id === params?.id;

  useEffect(() => {
    if (params?.id) {
      fetch(`/api/users/${params.id}`)
        .then(res => {
          if (!res.ok) throw new Error("User not found");
          return res.json();
        })
        .then(data => {
          setProfile(data.user);
          setLessons(data.lessons);
          
          // Pre-populate edit form
          setEditName(data.user.name);
          setEditDescription(data.user.description || "");
          setEditStudyAt(data.user.studyAt || "");
          setEditDateOfBirth(data.user.dateOfBirth || "");
          setEditImage(data.user.image || "");
          
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError("User not found or failed to load profile.");
          setLoading(false);
        });
    }
  }, [params?.id, session?.user?.id]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      alert("Name is required.");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
          studyAt: editStudyAt,
          dateOfBirth: editDateOfBirth,
          image: editImage
        })
      });
      const data = await res.json();
      if (res.ok) {
        setProfile({
          ...profile,
          name: editName,
          description: editDescription,
          studyAt: editStudyAt,
          dateOfBirth: editDateOfBirth,
          image: editImage
        });
        setIsEditing(false);
      } else {
        alert(data.error || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong updating the profile.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader message="Loading profile..." />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-error mb-2">Error</h2>
        <p className="text-on-surface-variant font-sans max-w-md mb-6">{error || "User profile not found."}</p>
        <button onClick={() => router.back()} className="btn btn-outline flex items-center gap-2">
          <MdArrowBack /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen bg-background">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className="btn btn-ghost hover:bg-white/5 text-on-surface-variant hover:text-on-surface flex items-center gap-2 pl-0 mb-8 font-sans transition-colors cursor-pointer"
        >
          <MdArrowBack className="text-lg" />
          <span>Back</span>
        </button>

        {/* Profile Card Header */}
        <div className="bg-bg-card rounded-2xl border border-white/5 p-6 md:p-10 mb-10 relative overflow-hidden">
          {/* Ambient overlay glow for premium */}
          {profile.isPremium && (
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[60px] pointer-events-none"></div>
          )}

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
            {/* Avatar */}
            <div className="relative shrink-0">
              {profile.isPremium && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-10 select-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
                  <FaCrown className="text-[#FFD700] text-3xl animate-bounce" />
                </div>
              )}
              <div className={`avatar ${profile.isPremium ? 'border-4 border-[#FFD700] rounded-full p-0.5 shadow-[0_0_20px_rgba(255,215,0,0.6)]' : 'border border-white/10 rounded-full'}`}>
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-background">
                  <img 
                    className="w-full h-full object-cover rounded-full"
                    alt={profile.name} 
                    src={profile.image || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"} 
                  />
                </div>
              </div>
              {profile.isPremium && (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#FFD700] text-background text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider font-mono shadow-lg whitespace-nowrap z-10 border border-[#FFD700]/30">
                  PREMIUM
                </span>
              )}
            </div>

            {/* Info details */}
            <div className="flex-grow space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-serif text-3xl md:text-4xl font-semibold text-text-heading">
                  {profile.name}
                </h1>
                
              </div>

              {/* Bio description (Show only if exists) */}
              {profile.description && (
                <p className="text-on-surface-variant text-base font-sans leading-relaxed max-w-xl">
                  {profile.description}
                </p>
              )}

              {/* Contact info, DOB, and Education (Show only if filled) */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm text-on-surface-variant font-sans">
                {profile.email && (
                  <div className="flex items-center gap-2">
                    <MdEmail className="text-base text-text-body/60" />
                    <span>{profile.email}</span>
                  </div>
                )}
                {profile.studyAt && (
                  <div className="flex items-center gap-2">
                    <MdSchool className="text-base text-primary" />
                    <span>Studies at <strong className="text-on-surface font-semibold">{profile.studyAt}</strong></span>
                  </div>
                )}
                {profile.dateOfBirth && (
                  <div className="flex items-center gap-2">
                    <MdCake className="text-base text-secondary" />
                    <span>Born on <strong className="text-on-surface font-semibold">{profile.dateOfBirth}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Profile Trigger */}
            {isOwner && !isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="btn btn-outline border-white/10 hover:bg-white/5 flex items-center gap-2 mt-4 md:mt-0 cursor-pointer self-start md:self-center"
              >
                <MdEdit /> Edit Profile
              </button>
            )}
          </div>

          {/* User Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-white/5 mt-8 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xl">
                <MdHistoryEdu />
              </div>
              <div>
                <div className="text-xs font-mono uppercase text-text-body/60">Lessons</div>
                <div className="text-xl font-bold font-sans text-on-surface">{profile.lessonsCount}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary text-xl">
                <MdFavorite />
              </div>
              <div>
                <div className="text-xs font-mono uppercase text-text-body/60">Total Likes</div>
                <div className="text-xl font-bold font-sans text-on-surface">{profile.totalLikes}</div>
              </div>
            </div>
            
            <div className="col-span-2 md:col-span-1 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-on-surface-variant">
                <MdCake className="text-xl" />
              </div>
              <div>
                <div className="text-xs font-mono uppercase text-text-body/60">Joined Sanctuary</div>
                <div className="text-sm font-bold font-sans text-on-surface">{new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form (Only shown if isEditing is true) */}
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A1D28] rounded-2xl border border-white/10 p-6 md:p-8 mb-10"
          >
            <h2 className="font-serif text-2xl font-semibold text-text-heading mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
              <MdEdit className="text-primary" /> Edit Profile Details
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono uppercase tracking-widest text-[11px] mb-2 text-text-body">Display Name</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="input input-bordered w-full bg-background border-white/10 text-on-surface focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase tracking-widest text-[11px] mb-2 text-text-body">Profile Image URL</label>
                  <input 
                    type="text" 
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    className="input input-bordered w-full bg-background border-white/10 text-on-surface focus:outline-none"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase tracking-widest text-[11px] mb-2 text-text-body">Bio / Description</label>
                <textarea 
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="textarea textarea-bordered w-full bg-background border-white/10 text-on-surface focus:outline-none min-h-[100px] resize-none"
                  placeholder="Tell others about yourself..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono uppercase tracking-widest text-[11px] mb-2 text-text-body">Study At / Occupation</label>
                  <input 
                    type="text" 
                    value={editStudyAt}
                    onChange={(e) => setEditStudyAt(e.target.value)}
                    className="input input-bordered w-full bg-background border-white/10 text-on-surface focus:outline-none"
                    placeholder="e.g. Dhaka University"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase tracking-widest text-[11px] mb-2 text-text-body">Date of Birth</label>
                  <input 
                    type="text" 
                    value={editDateOfBirth}
                    onChange={(e) => setEditDateOfBirth(e.target.value)}
                    className="input input-bordered w-full bg-background border-white/10 text-on-surface focus:outline-none"
                    placeholder="e.g. June 19, 2005"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="btn btn-outline border-white/10 hover:bg-white/5"
                  disabled={updating}
                >
                  <MdClose /> Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={updating}
                >
                  {updating ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <MdCheck />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* User's Lessons */}
        <div>
          <h2 className="font-serif text-2xl font-semibold text-text-heading mb-6 border-b border-white/5 pb-4">
            Wisdom Shared By {profile.name} ({lessons.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lessons.map((lesson) => (
              <Card key={lesson._id} {...lesson} />
            ))}
          </div>

          {lessons.length === 0 && (
            <div className="text-center py-16 bg-bg-card rounded-xl border border-white/5 text-on-surface-variant/60 font-sans italic">
              No wisdom lessons published yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
