import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 antialiased selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <main className="pt-14">
        {children}
      </main>
    </div>
  );
}
