'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  User,
  ShoppingBag,
  Store,
  Calendar,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Tag,
  Stethoscope,
  Laptop,
  Shirt,
} from 'lucide-react';

export default function OnboardingPage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [role, setRole] = useState<'customer' | 'shopkeeper'>('customer');

  // Shopkeeper dynamic fields
  const [shopName, setShopName] = useState('');
  const [shopCategory, setShopCategory] = useState('Kirana');
  const [shopAddress, setShopAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [error, setError] = useState('');

  // Fetch current user profile if already partially filled
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const profile = await res.json();
          if (profile.name) setName(profile.name);
          if (profile.dob) {
            setDob(profile.dob);
            calculateAge(profile.dob);
          } else if (profile.age) {
            setAge(profile.age);
          }
          if (profile.role === 'shopkeeper') setRole('shopkeeper');
          if (profile.shopName) setShopName(profile.shopName);
          if (profile.shopCategory) setShopCategory(profile.shopCategory);
          if (profile.shopAddress) setShopAddress(profile.shopAddress);

          // If profile is already complete, redirect to home
          if (profile.isProfileComplete) {
            router.push('/');
          }
        }
      } catch (err) {
        console.error('Error fetching profile during onboarding:', err);
      } finally {
        setFetchingProfile(false);
      }
    }

    if (status === 'authenticated') {
      loadProfile();
    } else if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Auto calculate age when Date of Birth changes
  const calculateAge = (dobString: string) => {
    if (!dobString) return;
    const birthDate = new Date(dobString);
    const today = new Date();
    let computedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      computedAge--;
    }
    if (computedAge >= 0 && computedAge <= 120) {
      setAge(computedAge);
    }
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDob(value);
    calculateAge(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!dob) {
      setError('Please select your Date of Birth.');
      return;
    }
    if (age === '' || Number(age) < 1 || Number(age) > 120) {
      setError('Please enter a valid age between 1 and 120.');
      return;
    }

    if (role === 'shopkeeper' && !shopName.trim()) {
      setError('Shopkeeper accounts require a Shop Name.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          dob,
          age: Number(age),
          role,
          shopName: role === 'shopkeeper' ? shopName.trim() : null,
          shopCategory: role === 'shopkeeper' ? shopCategory : null,
          shopAddress: role === 'shopkeeper' ? shopAddress.trim() : null,
        }),
      });

      if (res.ok) {
        // Trigger session update to sync complete profile state
        if (updateSession) {
          await updateSession({ isProfileComplete: true, name: name.trim(), role });
        }
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to complete profile. Please try again.');
      }
    } catch (err) {
      console.error('Onboarding submission error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || fetchingProfile) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-emerald-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-sm font-medium">Loading onboarding setup...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 backdrop-blur-md relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 font-bold">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
            Welcome to Local Cart AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Complete your user profile to personalize your local shopping or retail experience.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Account Type / Role Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Account Type / Role <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between space-y-3 ${
                  role === 'customer'
                    ? 'bg-emerald-500/10 border-emerald-500 text-slate-100 ring-1 ring-emerald-500 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  {role === 'customer' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-200">Customer / Buyer</h3>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Discover nearby Kirana, Medical & Electronics inventory.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('shopkeeper')}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between space-y-3 ${
                  role === 'shopkeeper'
                    ? 'bg-emerald-500/10 border-emerald-500 text-slate-100 ring-1 ring-emerald-500 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  {role === 'shopkeeper' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-200">Shopkeeper / Seller</h3>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Manage your local retail store, stock & instant discovery.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Date of Birth & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Date of Birth <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={handleDobChange}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-100 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Age (Years) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                placeholder="Auto-calculated"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          {/* Dynamic Shopkeeper Fields */}
          {role === 'shopkeeper' && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 pb-1 border-b border-slate-800">
                <Store className="w-4 h-4" />
                <span>Shopkeeper Details</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Shop Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required={role === 'shopkeeper'}
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Laxmi Kirana Store"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Category
                  </label>
                  <div className="relative">
                    <Tag className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                    <select
                      value={shopCategory}
                      onChange={(e) => setShopCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-100 focus:outline-none appearance-none"
                    >
                      <option value="Kirana">Kirana & Provisions</option>
                      <option value="Medical">Medical & Pharmacy</option>
                      <option value="Electronics">Electronics & Mobiles</option>
                      <option value="Fashion">Fashion & Apparel</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Shop Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={shopAddress}
                      onChange={(e) => setShopAddress(e.target.value)}
                      placeholder="e.g. Main Market, Delhi"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <span>Complete Profile & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
