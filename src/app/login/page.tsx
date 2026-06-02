'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Jika sudah login, langsung alihkan ke admin dashboard
    if (localStorage.getItem('isLoggedIn') === 'true') {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulasi delay login agar terasa premium & natural
    setTimeout(() => {
      if (email === 'admin@kopi.com' && password === 'admin') {
        localStorage.setItem('isLoggedIn', 'true');
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/admin');
        }, 800); // Tunda sebentar untuk transisi kesuksesan yang halus
      } else {
        setError('Email atau password salah. Silakan coba kembali.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center relative px-6 overflow-hidden selection:bg-violet-600/30 selection:text-violet-200">
      
      {/* Background glow ambient effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[150px]" />
      <div className="absolute bottom-10 right-10 -z-10 h-[300px] w-[300px] rounded-full bg-fuchsia-600/5 blur-[120px]" />

      {/* Back Button */}
      <div className="absolute top-8 left-8">
        <a
          href="/"
          className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-bold text-neutral-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Kembali ke Katalog</span>
        </a>
      </div>

      <div className="w-full max-w-md">
        
        {/* Logo and Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 shadow-xl shadow-violet-600/20 mb-4 animate-pulse">
            <span className="text-xl font-black text-white">A</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Admin Portal
          </h2>
          <p className="mt-2 text-xs text-neutral-400">
            Masuk dengan kredensial admin Anda untuk mengelola toko.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-950/50 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
              <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mb-6 scale-110 transition-all duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Autentikasi Sukses!</h3>
              <p className="text-xs text-neutral-400 mt-2">Membuka Dashboard Admin...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Error Message */}
              {error && (
                <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-4 text-xs text-red-400 flex items-start gap-2.5 animate-shake">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Alamat Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-neutral-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@kopi.com"
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/[0.08] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl text-sm text-white placeholder-neutral-600 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-neutral-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/[0.08] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl text-sm text-white placeholder-neutral-600 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-sm tracking-wide transition-all duration-300 shadow-lg shadow-violet-600/20 active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Masuk Sebagai Admin</span>
                )}
              </button>

            </form>
          )}
        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] text-neutral-600 mt-6 tracking-wide">
          © 2026 Marketplace AA Admin Console. All rights reserved.
        </p>

      </div>
    </div>
  );
}
