import React from 'react';
import Link from 'next/link';
import { MdLock, MdArrowForward } from 'react-icons/md';
import { authClient } from '@/lib/auth-client';

export default function Card({ _id, id, category, title, description, author, authorImage, link, isPremium = false, date }) {
  const { data: session } = authClient.useSession();
  const userIsPremium = session?.user?.isPremium === true;
  const isLocked = isPremium && !userIsPremium;

  const targetLink = link && link !== "#" ? link : `/browse-wisdom/${_id || id}`;
  const authorName = typeof author === 'object' && author !== null ? author.name : author;
  const avatarUrl = typeof author === 'object' && author !== null ? author.avatar : authorImage;
  
  return (
    <article className="card bg-bg-card rounded-xl border border-white/5 overflow-hidden group relative flex flex-col h-full transition-all duration-300 hover:border-white/15">
      <div className="card-body p-6 relative flex flex-col flex-grow gap-0">
        {isPremium ? (
          <div className="badge badge-primary badge-outline absolute top-4 right-4 text-[11px] font-mono uppercase tracking-wider z-10 border-primary-container/20 text-primary-container bg-primary-container/10">
            Premium
          </div>
        ) : (
          <div className="badge badge-success badge-outline absolute top-4 right-4 text-[11px] font-mono uppercase tracking-wider z-10 border-success/20 text-success bg-success/10">
            Free
          </div>
        )}
        
        <div className="mb-4 mt-2">
          <span className="text-xs font-mono text-primary uppercase tracking-[0.2em] mb-2 block">
            {category}
          </span>
          <h3 className="card-title font-serif text-xl font-semibold text-text-heading group-hover:text-primary transition-colors cursor-pointer">
            {title}
          </h3>
        </div>
        
        <p className="text-on-surface-variant text-base font-sans mb-6 line-clamp-3 flex-grow">
          {description}
        </p>
        
        <div className="card-actions mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-8 h-8 rounded-full">
                <img alt={authorName} src={avatarUrl || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-on-surface font-semibold text-[13px]">{authorName}</span>
              {date && <span className="text-on-surface-variant text-[11px] font-mono">{date}</span>}
            </div>
          </div>
          
          {isLocked ? (
            <span className="text-on-surface-variant font-sans text-sm font-medium flex items-center gap-1">
              See Details 
              <MdLock className="text-[18px]" />
            </span>
          ) : (
            <Link href={targetLink} className="btn btn-ghost btn-sm text-on-surface hover:text-primary hover:bg-transparent font-sans group/btn px-0">
              See Details 
              <MdArrowForward className="text-[18px] group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {isLocked && (
        <div className="absolute inset-0 backdrop-blur-md bg-background/60 flex flex-col items-center justify-center p-8 text-center transition-all duration-300">
          <MdLock className="text-[48px] text-surface-tint mb-4" />
          <h4 className="text-on-surface font-bold font-serif text-xl mb-2">Premium Lesson</h4>
          <p className="text-on-surface-variant font-sans text-sm mb-6">Unlock this deep-dive Masterclass on daily routines.</p>
          <Link href="/upgrade" className="btn btn-primary font-bold">
            Upgrade to View
          </Link>
        </div>
      )}
    </article>
  );
}
