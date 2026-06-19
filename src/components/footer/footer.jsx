import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <div className="bg-surface-container-lowest border-t border-surface-tint/20 w-full flex flex-col items-center">
      <footer className="footer sm:footer-horizontal text-base-content py-12 px-6 sm:px-10 max-w-[1200px] w-full gap-8 sm:gap-10">
        <aside className="w-full max-w-xs mb-4 sm:mb-0">
          <div className="font-serif text-2xl font-semibold text-on-surface font-bold mb-2">Digital Life Lessons</div>
          <p className="text-text-body text-sm leading-relaxed mb-4">
            A curated editorial platform dedicated to the preservation and sharing of life's most valuable lessons.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="btn btn-circle btn-sm btn-ghost bg-white/5 hover:text-primary">
              <img alt="X" className="w-4 h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH0Z_UznTizA36pQ-TLVye9o7PoMpm5Ip3YWlfl-_ZQxvDbFno7Ie1-gfxRMJByeXle1ZFVXjVI9FtN-9cCMz6995YS6JeU1MZMQoND93ntUgocDO3e4aob9hZXRHvWje5t3TrokYZpCY2qFQWm5p3tyv8rd_c39K4x9Rxh3Mr4cJMCx7Mg11F2QS09nfH9AtVlhYdHFKEaLVlXuEEJouedEfUqBYjyC0nBpp3FwRBdc5MsBWEpqkwAVay3fvAch6pqlC_ymqBRww" />
            </Link>
            <Link href="#" className="btn btn-circle btn-sm btn-ghost bg-white/5 hover:text-primary">
              <img alt="LinkedIn" className="w-4 h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUr7ygaYsldQbtsKT4SwovBS8bGV_MSDCIzoAKxTLVsB0-8mGrKMAR0Zt6SVDu-8RSzXN8hTPtg2p9aUGr6FjDTsnoTQP6tzFdbYq67Svcd0c-U8ghn24yifjcthOajTeYX7L-WArcaJ7AyI0chOwNxhI1a9DJdW74SGCheBIdazQnBnTY1o68na4M9-vUeT-_KmB9a8GfjLKTjsqvrCe6bXBtLJCBe4RcitpM3xZ9NOyKOarVwhU5Rgs_d1ZWLL02FeqG7GDjd4k" />
            </Link>
            <Link href="#" className="btn btn-circle btn-sm btn-ghost bg-white/5 hover:text-primary">
              <img alt="Facebook" className="w-4 h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCygUQpEcdH6bhJZZK9YsdccFwT7dx9ZEZ3LVpGxRz1iWRRQQB5BiUTQgYBp0maehv7Rcr68F_NbI_aPb9B9e9bdPgVJqIZIwtVKrm--AEGQAuayyDGNHzqucc7vCHU9YQweZO3pGApeLBXPnIZldxkHbcHp6IDlJT65LEyP1VBz9DTDyObCUlo0bO6p6xJjRfb2Gm9njTB7sBoEuHJjct7oRF4WDxI_C3g7rbqzVv1ab8I6d7e3BV-WrLfkBaOBgXFjYKVWSl8Wqo" />
            </Link>
          </div>
        </aside>
        
        <nav>
          <h6 className="footer-title text-surface-tint font-mono opacity-100 uppercase tracking-widest text-xs">Platform</h6>
          <Link href="/browse-wisdom" className="link link-hover hover:text-primary transition-colors text-text-body">Browse Lessons</Link>
          <Link href="#" className="link link-hover hover:text-primary transition-colors text-text-body">Writing Guide</Link>
          <Link href="#" className="link link-hover hover:text-primary transition-colors text-text-body">Community</Link>
          <Link href="/pricing" className="link link-hover hover:text-primary transition-colors text-text-body">Membership</Link>
        </nav>
        <nav>
          <h6 className="footer-title text-surface-tint font-mono opacity-100 uppercase tracking-widest text-xs">Legal</h6>
          <Link href="#" className="link link-hover hover:text-primary transition-colors text-text-body">Privacy Policy</Link>
          <Link href="#" className="link link-hover hover:text-primary transition-colors text-text-body">Terms of Service</Link>
          <Link href="#" className="link link-hover hover:text-primary transition-colors text-text-body">Intellectual Property</Link>
          <Link href="#" className="link link-hover hover:text-primary transition-colors text-text-body">Cookie Policy</Link>
        </nav>
        <nav>
          <h6 className="footer-title text-surface-tint font-mono opacity-100 uppercase tracking-widest text-xs">Resources</h6>
          <Link href="#" className="link link-hover hover:text-primary transition-colors text-text-body">Help Center</Link>
          <Link href="#" className="link link-hover hover:text-primary transition-colors text-text-body">Editorial Board</Link>
          <Link href="#" className="link link-hover hover:text-primary transition-colors text-text-body">Support Us</Link>
          <Link href="#" className="link link-hover hover:text-primary transition-colors text-text-body">Contact</Link>
        </nav>
      </footer>
      <footer className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-4 text-base-content border-surface-tint/10 border-t px-6 sm:px-10 py-6 max-w-[1200px] w-full text-center sm:text-left">
        <aside>
          <p className="font-sans text-sm text-on-surface-variant">© 2024 Digital Life Lessons. All rights reserved.</p>
        </aside>
        <nav>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 items-center text-xs text-on-surface-variant uppercase tracking-widest font-mono">
            <span>Designed for Wisdom</span>
            <span className="hidden sm:inline">•</span>
            <span>Built for Legacy</span>
          </div>
        </nav>
      </footer>
    </div>
  );
}
