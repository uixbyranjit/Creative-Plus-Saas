"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate API request
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-xl relative overflow-hidden">
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
          <h2 className="text-2xl font-bold tracking-tight">Recover Password</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Enter your email and we'll send recovery links.</p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 p-3.5 rounded-2xl border border-green-100 dark:border-green-900/50">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Passcode recovery instructions have been dispatched to your email outbox!</span>
            </div>
            <Link 
              href="/login" 
              className="w-full bg-brand-purple hover:bg-brand-purple-hover text-white py-3 rounded-2xl text-xs font-semibold shadow flex items-center justify-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold block mb-1.5">Registered Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@agency.com"
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-purple hover:bg-brand-purple-hover text-white py-3 rounded-2xl font-semibold shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Request Recovery Link</span>
              )}
            </button>

            <div className="text-center pt-2">
              <Link href="/login" className="inline-flex items-center gap-1 text-brand-purple hover:underline font-semibold">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
