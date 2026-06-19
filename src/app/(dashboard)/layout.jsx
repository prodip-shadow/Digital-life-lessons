"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/sidebar/sidebar';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin-panel');

  return (
    <div className="flex min-h-screen h-screen overflow-hidden bg-background w-full">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex-1 flex flex-col relative overflow-y-auto w-full">
        <main className="w-full px-4 md:px-12 flex-1 flex flex-col py-8 font-sans text-base">
          {children}
        </main>
      </div>
    </div>
  );
}
