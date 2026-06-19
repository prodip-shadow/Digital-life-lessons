"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import { MdKeyboardArrowDown, MdDashboard, MdLogout, MdPerson } from 'react-icons/md';
import { FaCrown } from 'react-icons/fa';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (session) {
      console.log("Logged in user session:", session.user);
    } else {
      console.log("No user session active.");
    }
  }, [session]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const getLinkClass = (path) => {
    const isActive = pathname === path;
    const baseClass = "transition-colors font-sans text-base ";
    if (isActive) {
      return baseClass + "text-primary font-bold";
    }
    return baseClass + "text-on-surface-variant hover:text-primary";
  };

  const navLinks = (
    <>
      <li><Link href="/" className={getLinkClass('/')}>Home</Link></li>
      <li><Link href="/browse-wisdom" className={getLinkClass('/browse-wisdom')}>Browse</Link></li>
      {session && (
        <>
          <li><Link href="/dashboard/my-lessons" className={getLinkClass('/dashboard/my-lessons')}>My Lessons</Link></li>
          <li><Link href="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link></li>
        </>
      )}
      <li><Link href="/upgrade" className={getLinkClass('/stories')}>Upgrade</Link></li>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-bg-sidebar/90 backdrop-blur-md border-b border-white/5 w-full flex justify-center">
      <div className="navbar max-w-[1400px] w-full px-4 md:px-8">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden pl-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-on-surface"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content mt-3 z-[1] p-4 shadow-xl bg-bg-card border border-white/10 rounded-box w-64 gap-2"
            >
              {navLinks}
              {session && (
                <>
                  <div className="divider my-1"></div>
                  <li>
                    <Link
                      href="/add-lesson"
                      className="btn btn-primary btn-sm w-full mt-1"
                    >
                      Write a Lesson
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <Link
            href="/"
            className="font-serif text-xl md:text-2xl font-bold text-on-surface hidden lg:flex"
          >
            Digital Life Lessons
          </Link>
        </div>
        <div className="navbar-center">
          <Link
            href="/"
            className="font-serif text-lg font-bold text-on-surface lg:hidden"
          >
            Digital Life
          </Link>
          <ul className="menu menu-horizontal px-1 gap-2 hidden lg:flex">
            {navLinks}
          </ul>
        </div>
        <div className="navbar-end gap-2 sm:gap-4">
          {session && (
            <Link
              href="/add-lesson"
              className="btn btn-sm lg:btn-md btn-primary hidden sm:flex"
            >
              Write a Lesson
            </Link>
          )}

          {session ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 hover:bg-white/5 p-1.5 rounded-full transition-colors cursor-pointer relative"
              >
                <div className="relative">
                  {session.user.isPremium && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 select-none animate-pulse">
                      <FaCrown className="text-[#FFD700] text-xs" />
                    </span>
                  )}
                  <div className={`avatar ${session.user.isPremium ? 'border-2 border-[#FFD700] rounded-full p-0.5 shadow-[0_0_10px_rgba(255,215,0,0.6)]' : ''}`}>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 overflow-hidden bg-bg-card">
                      <img
                        alt="User Avatar"
                        src={
                          session.user.image ||
                          'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'
                        }
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                </div>
                <span className="text-on-surface text-sm font-medium hidden md:inline-block max-w-[100px] truncate">
                  {session.user.name} 
                </span>
                <MdKeyboardArrowDown className="text-[18px] text-on-surface-variant hidden md:inline-block" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setDropdownOpen(false)}
                  ></div>

                  <div className="absolute right-0 mt-2 w-48 bg-[#1A1D28] border border-white/5 rounded-xl shadow-2xl p-2 z-40 space-y-1">
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                      <p className="text-[10px] text-text-body/60 font-mono tracking-widest uppercase">
                        SIGNED IN AS
                      </p>
                      <p className="text-sm font-semibold truncate text-on-surface">
                        {session.user.name}
                      </p>
                    </div>
                   
                    <Link
                      href={`/profile/${session.user.id}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-on-surface hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <MdPerson className="text-[18px]" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg text-left transition-colors cursor-pointer"
                    >
                      <MdLogout className="text-[18px]" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="btn btn-sm btn-ghost text-on-surface hover:bg-white/5 font-sans font-medium"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className="btn btn-sm btn-primary font-sans font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
