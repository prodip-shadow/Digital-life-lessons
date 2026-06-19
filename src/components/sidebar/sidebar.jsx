"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import { 
  MdHome, 
  MdAddCircle, 
  MdDashboard, 
  MdAutoStories, 
  MdFavorite, 
  MdGroup, 
  MdMenuBook, 
  MdReport, 
  MdPerson, 
  MdSettings, 
  MdAnalytics 
} from 'react-icons/md';
import { FaCrown } from 'react-icons/fa';

const IconMap = {
  home: MdHome,
  add_circle: MdAddCircle,
  dashboard: MdDashboard,
  auto_stories: MdAutoStories,
  favorite: MdFavorite,
  group: MdGroup,
  menu_book: MdMenuBook,
  report: MdReport,
  person: MdPerson,
  settings: MdSettings,
  analytics: MdAnalytics
};

export default function Sidebar({ isAdmin = false }) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const userLinks = [
    { href: '/', icon: 'home', label: 'Home' },
    { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { href: '/add-lesson', icon: 'add_circle', label: 'Add Lesson' },
    { href: '/dashboard/my-lessons', icon: 'auto_stories', label: 'My Lessons' },
    { href: '/dashboard/favorites', icon: 'favorite', label: 'Favorites' },
    ...(session?.user?.isPremium ? [{ href: '/dashboard/earnings-history', icon: 'analytics', label: 'Earnings History' }] : []),
  ];

  const adminLinks = [
    { href: '/admin-panel', icon: 'dashboard', label: 'Dashboard' },
    { href: '#', icon: 'group', label: 'Manage Users' },
    { href: '#', icon: 'menu_book', label: 'Manage Lessons' },
    { href: '#', icon: 'report', label: 'Reported Lessons' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="w-64 bg-bg-sidebar border-r border-white/5 flex flex-col shrink-0 h-full z-20">
      <div className="p-8">
        <span className="font-serif text-2xl font-semibold font-bold text-on-surface">Digital Life Lessons</span>
        {isAdmin && (
          <div className="mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-mono uppercase tracking-widest text-[12px] text-primary">ADMIN CONSOLE</span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {links.map((link, idx) => {
          const isActive = pathname === link.href;
          const IconComponent = IconMap[link.icon] || MdHome;
          return (
            <Link 
              key={idx} 
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-white/5 border-r-2 border-secondary text-secondary' 
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
              }`}
            >
              <IconComponent className="text-[20px]" />
              <span className={`font-sans text-base ${isActive ? 'font-bold' : ''}`}>{link.label}</span>
            </Link>
          );
        })}

        {!isAdmin && (
          <>
            <div className="pt-8 pb-4">
              <span className="px-4 font-mono uppercase tracking-widest text-[12px] text-text-body/50">ACCOUNT</span>
            </div>
            <Link href={session?.user?.id ? `/profile/${session.user.id}` : "/sign-in"} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-on-surface-variant hover:bg-white/5">
              <MdPerson className="text-[20px]" />
              <span className="font-sans text-base">Profile</span>
            </Link>
          </>
        )}

        {isAdmin && (
          <>
            <div className="pt-4 pb-2 border-t border-white/5 mt-4">
              <span className="px-4 font-mono uppercase tracking-widest text-[12px] opacity-40">System</span>
            </div>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-on-surface-variant hover:bg-white/5">
              <MdSettings className="text-[20px]" />
              <span className="font-sans text-base">Settings</span>
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-on-surface-variant hover:bg-white/5">
              <MdAnalytics className="text-[20px]" />
              <span className="font-sans text-base">Insights</span>
            </Link>
          </>
        )}
      </nav>

      <div className="p-6 border-t border-white/5">
        {session ? (
          <div className={`flex items-center gap-3 ${isAdmin ? 'px-4 py-3 bg-bg-card rounded-xl border border-white/5' : ''}`}>
            <div className="relative shrink-0">
              {!isAdmin && session.user.isPremium && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 select-none animate-pulse">
                  <FaCrown className="text-[#FFD700] text-xs" />
                </span>
              )}
              <div className={`w-10 h-10 rounded-full overflow-hidden bg-surface-container shrink-0 ${!isAdmin && session.user.isPremium ? 'border-2 border-[#FFD700] p-0.5 shadow-[0_0_8px_rgba(255,215,0,0.5)]' : 'border border-white/10'}`}>
                <img 
                  className="w-full h-full object-cover rounded-full" 
                  alt="User profile" 
                  src={isAdmin 
                    ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAq5N3KQy6fgv0eh9Yi_T8tC2zIIwhp3M6C9qS4032K5PpupT5r0TKaOFlEgMnjdSk1jhYvcybdSnyXs-ct60aYyMlH-5qseKHAy2TYFwrHUJBClbTHGWOfji8tOLzISJv98YLYYjuUQlP8T_O4Bx6ZpGkHuwOzhaNvRAmi0Igyg2GFyVJZbetpfi3tXS8RBTSiuowwcRY6Isvm9GtgnC5ENoLoSf_bFoWyy8Lcbwe2IoyJLKdleiVQE8Dse06B5l7PLw_wdyR--Jo" 
                    : (session.user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150")
                  } 
                />
              </div>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className={`text-sm font-semibold truncate ${isAdmin ? 'text-on-surface font-bold' : 'text-on-surface'}`}>
                {isAdmin ? 'Admin Chief' : session.user.name}
              </span>
              <span className={isAdmin ? "font-mono uppercase tracking-widest text-[10px] text-primary truncate" : "text-xs text-text-body/60 truncate"}>
                {isAdmin ? 'SYSTEM OWNER' : session.user.email}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <span className="text-xs text-text-body/60">Not signed in</span>
            <Link href="/sign-in" className="btn btn-sm btn-primary w-full">Sign In</Link>
          </div>
        )}
      </div>
    </aside>
  );
}
