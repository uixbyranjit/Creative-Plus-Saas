import Link from 'next/link';
import { ArrowRight, BarChart2, Shield, Sparkles, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-brand-purple flex items-center justify-center text-white shadow-md">
            <span className="font-extrabold text-sm">C+</span>
          </div>
          <div>
            <h1 className="font-bold text-sm leading-none">Creative Plus</h1>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Operations CRM</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-xs font-semibold hover:text-brand-purple transition">
            Sign In
          </Link>
          <Link href="/register" className="bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md transition">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
        {/* Colorful glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-purple/5 dark:bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-brand-purple-light dark:bg-brand-purple/15 text-brand-purple px-4 py-1.5 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Operations CRM</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Supercharge Your Agency <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-purple-400">
              Operations & Creativity
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            The premium Micro SaaS tailored specifically for Creative Plus Digital Marketing Agency. Manage leads, orders, tasks, payment invoicing, and client collaborations inside a unified hub.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto bg-brand-purple hover:bg-brand-purple-hover text-white px-8 py-3.5 rounded-2xl text-sm font-semibold shadow-lg hover:shadow-brand-purple/20 transition flex items-center justify-center gap-2 cursor-pointer">
              <span>Enter Portal Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="w-full sm:w-auto bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 px-8 py-3.5 rounded-2xl text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer">
              <span>Access Client Portal</span>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-24 w-full">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 text-left shadow-premium hover:shadow-premium-hover transition duration-200">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-brand-purple flex items-center justify-center mb-4">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-1">Deep Analytics & KPI Reports</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Track revenue growth, pending payments, active retainers, and client acquisition statistics in one premium interface.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 text-left shadow-premium hover:shadow-premium-hover transition duration-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-1">Client CRM & Secure Portal</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Manage leads through a custom pipeline, convert to active client portfolios, and provide secure self-serve portals.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 text-left shadow-premium hover:shadow-premium-hover transition duration-200">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-1">Role-Based Access Guard</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Strict workspace privacy partitions for Admins, Managers, Designers, Employees, and Clients to ensure data protection.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
        &copy; {new Date().getFullYear()} Creative Plus Digital Marketing Agency. All rights reserved.
      </footer>
    </div>
  );
}

