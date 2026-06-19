import React from 'react';
import Navbar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';

export default function CommonLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-on-surface font-sans text-base">
      <Navbar />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
