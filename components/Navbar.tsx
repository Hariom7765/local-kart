'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Store, ShieldCheck, User, LogOut, Sparkles, MapPin, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CustomerAuthModal } from './CustomerAuthModal';
import { OnboardingCheck } from './OnboardingCheck';

export function Navbar() {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [localProfile, setLocalProfile] = useState<{ name?: string; role?: string } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('local_kart_user_profile');
      if (saved) {
        setLocalProfile(JSON.parse(saved));
      }
    } catch (_) {}
  }, [session]);

  const userRole = localProfile?.role || (session?.user as any)?.role || 'customer';
  const userName = localProfile?.name || session?.user?.name || session?.user?.email || 'User';

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-lg">
      <OnboardingCheck />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            <Store className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-lg tracking-tight">
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Local Cart
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-3 h-3 animate-pulse" /> AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-1 hidden sm:block">
              Neighborhood Retail, Instant Access
            </p>
          </div>
        </Link>

        {/* Navigation Links & User Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors hidden md:flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4 text-emerald-400" /> Nearby Shops
          </Link>

          {/* Shopkeeper Manage Inventory Button */}
          {userRole === 'shopkeeper' && (
            <Link
              href="/shopkeeper/dashboard"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold px-3.5 py-1.5 rounded-xl text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Store className="w-4 h-4" />
              <span>+ Manage Inventory</span>
            </Link>
          )}

          <Link
            href="/admin/dashboard"
            className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" /> Admin Portal
          </Link>

          {/* User Profile Pill */}
          {session ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl text-sm text-slate-200 transition-colors shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-inner">
                  {userName[0].toUpperCase()}
                </div>

                <div className="flex items-center gap-1.5 text-left">
                  <span className="hidden sm:inline font-bold text-xs max-w-[120px] truncate text-slate-100">
                    {userName}
                  </span>

                  {/* Role Badge */}
                  {userRole === 'shopkeeper' ? (
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Store className="w-3 h-3" /> Seller
                    </span>
                  ) : userRole === 'admin' ? (
                    <span className="px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Admin
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <User className="w-3 h-3" /> Buyer
                    </span>
                  )}
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-1 text-sm text-slate-300 z-50 animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-slate-800">
                  <div className="px-4 py-3">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="font-bold text-slate-100 truncate text-xs mt-0.5">
                      {userName}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                      {session.user?.email || 'Authenticated User'}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/onboarding"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full text-left px-4 py-2 hover:bg-slate-800 text-slate-300 flex items-center gap-2 text-xs transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" /> Edit Profile Details
                    </Link>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 hover:bg-slate-800 text-rose-400 hover:text-rose-300 flex items-center gap-2 text-xs transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold px-3.5 py-1.5 rounded-lg text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <User className="w-4 h-4" />
              <span>Customer Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Customer Auth Modal */}
      <CustomerAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  );
}
