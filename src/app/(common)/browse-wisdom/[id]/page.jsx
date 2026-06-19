"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  MdArrowForward, 
  MdFavorite, 
  MdBookmark, 
  MdVisibility, 
  MdShare,
  MdLock
} from 'react-icons/md';
import { authClient } from '@/lib/auth-client';

export default function LessonDetailsPage() {
  const params = useParams();
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();
  
  // Likes & bookmarks counts
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  
  // Comments states
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [replyToId, setReplyToId] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  
  // Share dropdown
  const [shareOpen, setShareOpen] = useState(false);

  const userIsPremium = session?.user?.isPremium === true;
  const isLocked = lesson?.isPremium && !userIsPremium;

  useEffect(() => {
    if (params?.id) {
      fetch(`/api/lessons/${params.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setLesson(null);
          } else {
            setLesson(data);
            setLikesCount(data.likedBy?.length || parseFloat(data.stats?.likes) || 0);
            setBookmarksCount(data.favoritesBy?.length || parseFloat(data.stats?.bookmarks) || 0);
            if (session?.user?.id) {
              setLiked(data.likedBy?.includes(session.user.id) || false);
              setFavorited(data.favoritesBy?.includes(session.user.id) || false);
            }
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch lesson details:", err);
          setLoading(false);
        });

      // Fetch Comments
      fetch(`/api/lessons/${params.id}/comments`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setComments(data);
          }
        })
        .catch(err => console.error("Failed to fetch comments:", err));
    }
  }, [params?.id, session?.user?.id]);

  const handleLike = async () => {
    if (!session) {
      alert("Please sign in to like lessons.");
      return;
    }
    try {
      const res = await fetch(`/api/lessons/${lesson._id}/like`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setLiked(data.liked);
        setLikesCount(data.likesCount);
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleFavorite = async () => {
    if (!session) {
      alert("Please sign in to save lessons to favorites.");
      return;
    }
    try {
      const res = await fetch(`/api/lessons/${lesson._id}/favorite`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setFavorited(data.favorited);
        setBookmarksCount(data.bookmarksCount);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handlePostComment = async () => {
    if (!session) {
      alert("Please sign in to post comments.");
      return;
    }
    if (!newCommentContent.trim()) return;
    try {
      const res = await fetch(`/api/lessons/${lesson._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newCommentContent })
      });
      const comment = await res.json();
      if (res.ok) {
        setComments([...comments, comment]);
        setNewCommentContent("");
      } else {
        alert(comment.error || "Failed to post comment");
      }
    } catch (err) {
      console.error("Post comment failed:", err);
    }
  };

  const handlePostReply = async (parentId) => {
    if (!session) {
      alert("Please sign in to reply.");
      return;
    }
    if (!replyContent.trim()) return;
    try {
      const res = await fetch(`/api/lessons/${lesson._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent, parentId })
      });
      const comment = await res.json();
      if (res.ok) {
        setComments([...comments, comment]);
        setReplyContent("");
        setReplyToId(null);
      } else {
        alert(comment.error || "Failed to post reply");
      }
    } catch (err) {
      console.error("Post reply failed:", err);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!session) {
      alert("Please sign in to like comments.");
      return;
    }
    try {
      const res = await fetch(`/api/comments/${commentId}/like`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setComments(comments.map(c => {
          if (c._id === commentId) {
            return { ...c, likedBy: data.likedBy };
          }
          return c;
        }));
      }
    } catch (err) {
      console.error("Like comment failed:", err);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-serif text-2xl">Loading...</div>;
  }

  if (!lesson) {
    return <div className="min-h-screen flex items-center justify-center font-serif text-2xl">Lesson not found or deleted.</div>;
  }

  return (
    <div className="pt-32 pb-24 px-4 min-h-screen">
      <article className="max-w-[760px] mx-auto">
        {/* Cover Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full h-[440px] rounded-xl overflow-hidden mb-12 border border-white/5"
        >
          <img 
            className="w-full h-full object-cover" 
            alt="Cover Image" 
            src={lesson.coverImage} 
          />
        </motion.div>

        {/* Meta & Heading */}
        <div className="space-y-6 mb-10">
          <div className="flex flex-wrap gap-3 items-center">
            {(lesson.tags || []).map(tag => (
              <span key={tag} className="badge badge-outline border-primary-container/20 text-primary-fixed-dim bg-primary-container/10 px-3 py-3 uppercase tracking-wider">{tag}</span>
            ))}
          </div>
          <h1 className="text-5xl leading-tight text-text-heading font-serif">
            {lesson.title}
          </h1>

          {/* Author Card */}
          <div className="flex items-center p-4 bg-bg-card rounded-xl border border-white/5 hover:border-white/15 transition-all group">
            <img 
              className="w-12 h-12 rounded-full object-cover mr-4 grayscale hover:grayscale-0 transition-all duration-500" 
              alt={lesson.author?.name || "Author"} 
              src={lesson.author?.avatar || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"} 
            />
            <div className="flex-grow">
              <div className="font-semibold text-on-surface">{lesson.author?.name || "Anonymous"}</div>
              <div className="text-xs text-on-surface-variant">{lesson.author?.lessonsCount || 0} lessons created</div>
            </div>
            <Link href={`/profile/${lesson.userId}`} className="text-primary-container font-sans font-semibold text-sm hover:underline flex items-center gap-1">
              View Profile <MdArrowForward className="text-xs" />
            </Link>
          </div>
        </div>

        {/* Content Body */}
        {isLocked ? (
          <div className="bg-bg-card border-2 border-primary/20 rounded-2xl p-8 md:p-12 text-center my-12 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[60px] pointer-events-none"></div>
            
            <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container mx-auto mb-6">
              <MdLock className="text-3xl" />
            </div>
            
            <h3 className="font-serif text-3xl font-bold text-text-heading mb-4">
              Premium Lesson Sanctuary
            </h3>
            
            <p className="font-sans text-base text-text-body/90 max-w-md mx-auto mb-8">
              This reflection is reserved for members of the Premium Sanctuary. Upgrade to Premium to unlock a lifetime of curated digital life lessons and premium tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/upgrade" className="btn btn-primary btn-lg font-bold px-8 shadow-lg shadow-primary/20">
                Upgrade to Premium
              </Link>
              <Link href="/browse-wisdom" className="btn btn-outline border-white/10 hover:bg-white/5 btn-lg font-medium px-8">
                Explore Free Lessons
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-lg leading-[1.8] text-on-surface-variant mb-12 first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:mt-2 first-letter:text-primary">
              {(lesson.content || []).map((paragraph, idx) => (
                <p key={idx} className="mb-6">{paragraph}</p>
              ))}
              
              {lesson.quote && (
                <blockquote className="italic font-serif text-2xl text-on-surface border-l-2 border-primary pl-8 my-10 py-2">
                  "{lesson.quote}"
                </blockquote>
              )}
              
              {lesson.closing && <p className="mb-6">{lesson.closing}</p>}
            </div>

            {/* Engagement Pill */}
            <div className="flex flex-wrap justify-between items-center py-6 border-y border-white/5 mb-12 relative">
              <div className="flex items-center bg-white/5 rounded-full px-6 py-2 gap-8 border border-white/10">
                <button onClick={handleLike} className={`btn btn-ghost btn-sm text-on-surface-variant hover:text-primary group flex items-center gap-1.5 ${liked ? 'text-primary' : ''}`}>
                  <MdFavorite className={liked ? 'fill-current text-primary' : 'group-hover:fill-current'} />
                  <span className="text-sm font-medium">{likesCount}</span>
                </button>
                <button onClick={handleFavorite} className={`btn btn-ghost btn-sm text-on-surface-variant hover:text-surface-tint flex items-center gap-1.5 ${favorited ? 'text-surface-tint' : ''}`}>
                  <MdBookmark className={favorited ? 'fill-current text-surface-tint' : ''} />
                  <span className="text-sm font-medium">{bookmarksCount}</span>
                </button>
                <div className="flex items-center gap-2 text-on-surface-variant/60">
                  <MdVisibility />
                  <span className="text-sm font-medium">{lesson.stats?.views || 0}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-4 md:mt-0 relative">
                <button 
                  onClick={handleFavorite}
                  className={`btn flex items-center gap-1.5 ${favorited ? 'btn-primary bg-surface-tint text-background border-surface-tint hover:bg-surface-tint/90' : 'btn-outline border-primary/40 text-primary-container hover:bg-primary/5'}`}
                >
                  <MdBookmark className="text-sm" />
                  {favorited ? 'Favorited' : 'Save to Favorites'}
                </button>
                <button 
                  onClick={handleLike}
                  className={`btn shadow-lg flex items-center gap-1.5 ${liked ? 'btn-primary scale-105' : 'btn-outline border-primary/30 text-primary hover:bg-primary hover:text-background'}`}
                >
                  <MdFavorite className="text-sm" />
                  {liked ? 'Liked' : 'Like'}
                </button>
                <div className="relative">
                  <button onClick={() => setShareOpen(!shareOpen)} className="btn btn-square btn-outline border-white/10 hover:bg-white/10 flex items-center justify-center">
                    <MdShare className="text-on-surface text-lg" />
                  </button>
                  {shareOpen && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setShareOpen(false)}></div>
                      <div className="absolute right-0 mt-2 w-48 bg-[#1A1D28] border border-white/5 rounded-xl shadow-2xl p-2 z-30 space-y-1">
                        <div className="px-3 py-1.5 text-xs font-mono tracking-wider text-text-body/50 border-b border-white/5 mb-1">
                          SHARE REFLECTION
                        </div>
                        <button 
                          onClick={() => {
                            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(lesson.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
                            setShareOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-on-surface hover:bg-white/5 rounded-lg text-left"
                        >
                          Twitter / X
                        </button>
                        <button 
                          onClick={() => {
                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                            setShareOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-on-surface hover:bg-white/5 rounded-lg text-left"
                        >
                          Facebook
                        </button>
                        <button 
                          onClick={() => {
                            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                            setShareOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-on-surface hover:bg-white/5 rounded-lg text-left"
                        >
                          LinkedIn
                        </button>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Link copied to clipboard!");
                            setShareOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-primary hover:bg-white/5 rounded-lg text-left"
                        >
                          Copy Link
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Comment Section */}
            <section className="space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl font-semibold text-text-heading">Responses ({comments.length})</h3>
              </div>
              
              {/* Input Area */}
              <div className="bg-bg-card p-6 rounded-xl border border-white/5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                    <img className="w-full h-full object-cover" alt="User" src={session?.user?.image || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"} />
                  </div>
                  <div className="flex-grow space-y-4">
                    <textarea 
                      value={newCommentContent}
                      onChange={(e) => setNewCommentContent(e.target.value)}
                      className="textarea textarea-bordered w-full bg-background border-white/10 text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary-container min-h-[100px] resize-none focus:outline-none" 
                      placeholder={session ? "Share your reflection..." : "Please login to write a comment"}
                      disabled={!session}
                    ></textarea>
                    <div className="flex justify-end">
                      <button onClick={handlePostComment} className="btn btn-primary" disabled={!session || !newCommentContent.trim()}>
                        Post Thought
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment List */}
              <div className="space-y-8">
                {comments.filter(c => !c.parentId).map(comment => {
                  const commentReplies = comments.filter(r => r.parentId === comment._id);
                  const hasLikedComment = comment.likedBy?.includes(session?.user?.id);
                  
                  return (
                    <div key={comment._id} className="space-y-4">
                      {/* Parent Comment */}
                      <div className="flex gap-4">
                        <Link href={`/profile/${comment.userId}`} className="shrink-0">
                          <img className="w-10 h-10 rounded-full object-cover border border-white/10 hover:border-primary/50 transition-colors" alt={comment.userName} src={comment.userAvatar || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"} />
                        </Link>
                        <div className="flex-grow space-y-2">
                          <div className="flex items-center justify-between">
                            <Link href={`/profile/${comment.userId}`} className="font-semibold text-on-surface hover:underline">{comment.userName}</Link>
                            <span className="text-xs text-on-surface-variant">{new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                          <div className="flex items-center gap-4 pt-1">
                            <button 
                              onClick={() => {
                                setReplyToId(replyToId === comment._id ? null : comment._id);
                                setReplyContent("");
                              }} 
                              className="btn btn-link btn-xs text-primary px-0 no-underline hover:underline"
                            >
                              {replyToId === comment._id ? 'Cancel' : 'Reply'}
                            </button>
                            <button onClick={() => handleLikeComment(comment._id)} className={`btn btn-ghost btn-xs text-on-surface-variant group px-1 flex items-center gap-1 ${hasLikedComment ? 'text-primary' : ''}`}>
                              <MdFavorite className={`text-sm ${hasLikedComment ? 'fill-current text-primary' : 'group-hover:text-primary'}`} /> {comment.likedBy?.length || 0}
                            </button>
                          </div>
                          
                          {/* Reply Input Form */}
                          {replyToId === comment._id && (
                            <div className="mt-3 bg-bg-card/40 p-4 rounded-xl border border-white/5 space-y-3">
                              <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="textarea textarea-bordered w-full bg-background border-white/10 text-on-surface focus:outline-none min-h-[60px] resize-none text-sm"
                                placeholder={`Reply to ${comment.userName}...`}
                              />
                              <div className="flex justify-end">
                                <button onClick={() => handlePostReply(comment._id)} className="btn btn-primary btn-xs font-semibold px-4" disabled={!replyContent.trim()}>
                                  Reply
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Indented Replies */}
                      {commentReplies.length > 0 && (
                        <div className="pl-12 space-y-4 border-l border-white/5 ml-5 mt-2">
                          {commentReplies.map(reply => {
                            const hasLikedReply = reply.likedBy?.includes(session?.user?.id);
                            return (
                              <div key={reply._id} className="flex gap-4">
                                <Link href={`/profile/${reply.userId}`} className="shrink-0">
                                  <img className="w-8 h-8 rounded-full object-cover border border-white/10 hover:border-primary/50 transition-colors" alt={reply.userName} src={reply.userAvatar || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"} />
                                </Link>
                                <div className="flex-grow space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <Link href={`/profile/${reply.userId}`} className="font-semibold text-on-surface text-sm hover:underline">{reply.userName}</Link>
                                      {reply.replyToUserName && (
                                        <span className="text-xs text-text-body/50 font-sans">
                                          replied to <Link href={`/profile/${reply.replyToUserId}`} className="text-primary hover:underline font-semibold">{reply.replyToUserName}</Link>
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-on-surface-variant">{new Date(reply.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                                  <div className="flex items-center gap-4 pt-1">
                                    <button onClick={() => handleLikeComment(reply._id)} className={`btn btn-ghost btn-xs text-on-surface-variant group px-1 flex items-center gap-1 ${hasLikedReply ? 'text-primary' : ''}`}>
                                      <MdFavorite className={`text-sm ${hasLikedReply ? 'fill-current text-primary' : 'group-hover:text-primary'}`} /> {reply.likedBy?.length || 0}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {comments.length === 0 && (
                  <div className="text-center py-8 text-on-surface-variant/50 text-sm italic">
                    No reflections yet. Be the first to share your thoughts.
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </article>
    </div>
  );
}
