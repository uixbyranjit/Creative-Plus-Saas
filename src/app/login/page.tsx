"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, Key, Mail, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    { label: "Admin", email: "admin@creativeplus.com", pass: "password123", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" },
    { label: "Manager", email: "manager@creativeplus.com", pass: "password123", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" },
    { label: "Designer", email: "designer@creativeplus.com", pass: "password123", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" },
    { label: "Client", email: "client@creativeplus.com", pass: "password123", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" },
  ];

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log("1. Login form submitted for email:", email);
      console.log("2. signIn() called");
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      console.log("signIn() returned response status:", res?.status, "error:", res?.error);

      if (res?.error) {
        setError('Invalid email or password combination');
        setLoading(false);
      } else {
        console.log("14. Cookie written successfully (session complete)");
        console.log("15. Redirect started - Fetching session...");
        
        // Fetch session to determine role redirect
        const sessionRes = await fetch('/api/auth/session');
        console.log("Session API Response received:", sessionRes.status);
        const session = await sessionRes.json();
        console.log("Session JSON parsed. User role:", session?.user?.role);
        
        if (session?.user?.role === 'CLIENT') {
          console.log("Routing to: /client-portal");
          router.push('/client-portal');
        } else {
          console.log("Routing to: /dashboard");
          router.push('/dashboard');
        }
        console.log("16. Redirect completed successfully");
        router.refresh();
      }
    } catch (err) {
      console.error("❌ Login exception caught client-side:", err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-purple/10 dark:bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />
        
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-purple flex items-center justify-center text-white shadow-lg">
            <span className="font-extrabold text-lg">C+</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">Creative Plus</h1>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Digital Marketing Agency</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Sign in to manage your campaigns, orders, and pipeline.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-2xl text-xs mb-4 border border-red-100 dark:border-red-900/50">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@agency.com"
                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">Password</label>
              <Link href="/forgot-password" className="text-xs text-brand-purple hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-purple hover:bg-brand-purple-hover text-white py-3 rounded-2xl text-sm font-semibold shadow-lg hover:shadow-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-zinc-100 dark:border-zinc-800 pt-6">
          <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-3">One-Click Demo Login</span>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((account, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickLogin(account.email, account.pass)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 flex flex-col items-start cursor-pointer text-left ${account.color}`}
              >
                <span>{account.label}</span>
                <span className="opacity-70 font-normal text-[10px] truncate max-w-full">{account.email}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          New to Creative Plus?{' '}
          <Link href="/register" className="text-brand-purple hover:underline font-semibold">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
