'use client';

import { useState, useEffect, useTransition } from 'react';
import { ShopCard } from '@/components/ShopCard';
import { calculateHaversineDistance } from '@/lib/haversine';
import {
  Search,
  Navigation,
  Sparkles,
  ShoppingBag,
  Stethoscope,
  Laptop,
  Shirt,
  Store,
  RefreshCw,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

interface Shop {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  isVerified: boolean;
  isPromoted: boolean;
  products: Product[];
}

const CATEGORIES = ['All', 'Kirana', 'Medical', 'Electronics', 'Fashion'];

export default function HomePage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  // Geolocation State
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [geoMessage, setGeoMessage] = useState('');

  // Fetch Shops
  const fetchShops = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/shops', window.location.origin);
      if (searchQuery) url.searchParams.set('q', searchQuery);
      if (selectedCategory && selectedCategory !== 'All') {
        url.searchParams.set('category', selectedCategory);
      }

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setShops(data);
      }
    } catch (error) {
      console.error('Failed to fetch shops:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, [selectedCategory]);

  // Handle Search Input Change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    startTransition(() => {
      fetchShops();
    });
  };

  // Geolocation Handler using Haversine formula
  const handleFindNearMe = () => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      setGeoMessage('Geolocation is not supported by your browser.');
      return;
    }

    setGeoStatus('loading');
    setGeoMessage('Detecting your location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserCoords({ lat, lng });
        setGeoStatus('success');
        setGeoMessage(`Location detected (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`);
      },
      () => {
        // Fallback demo location: Connaught Place, New Delhi (28.6315, 77.2167)
        const demoLat = 28.6315;
        const demoLng = 77.2167;
        setUserCoords({ lat: demoLat, lng: demoLng });
        setGeoStatus('success');
        setGeoMessage('Used demo location (New Delhi Central)');
      },
      { timeout: 8000 }
    );
  };

  // Compute distance and sort shops
  const processedShops = shops
    .map((shop) => {
      let distanceKm: number | null = null;
      if (userCoords) {
        distanceKm = calculateHaversineDistance(
          userCoords.lat,
          userCoords.lng,
          shop.latitude,
          shop.longitude
        );
      }
      return { ...shop, distanceKm };
    })
    .sort((a, b) => {
      if (userCoords && a.distanceKm !== null && b.distanceKm !== null) {
        return a.distanceKm - b.distanceKm;
      }
      // Default: Promoted first, then Verified, then newest
      if (a.isPromoted !== b.isPromoted) return a.isPromoted ? -1 : 1;
      if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1;
      return 0;
    });

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold shadow-inner">
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
            <span>AI Hyper-Local Retail Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Connect With{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Neighborhood Shops
            </span>{' '}
            Instantly
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Search live stock across local Kirana, Medical, Electronics & Fashion stores. Get instant WhatsApp order routing and Haversine distance tracking.
          </p>

          {/* DYNAMIC AI SEARCH BAR */}
          <div className="pt-2 max-w-2xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchShops();
              }}
              className="relative flex items-center"
            >
              <div className="relative w-full">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="AI Search e.g. 'Aashirvaad Atta', 'Paracetamol', 'boAt Earbuds'..."
                  className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-emerald-400 rounded-2xl pl-12 pr-28 py-4 text-sm sm:text-base text-slate-100 placeholder-slate-500 shadow-2xl focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* GEOLOCATION ACTION BUTTON */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleFindNearMe}
              disabled={geoStatus === 'loading'}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Navigation
                className={`w-4 h-4 text-emerald-400 ${
                  geoStatus === 'loading' ? 'animate-spin' : ''
                }`}
              />
              <span>{geoStatus === 'loading' ? 'Locating...' : 'Find Near Me'}</span>
            </button>

            {geoStatus === 'success' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{geoMessage}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* CATEGORY FILTER PILLS */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-105'
                      : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {cat === 'Kirana' && <ShoppingBag className="w-3.5 h-3.5" />}
                  {cat === 'Medical' && <Stethoscope className="w-3.5 h-3.5" />}
                  {cat === 'Electronics' && <Laptop className="w-3.5 h-3.5" />}
                  {cat === 'Fashion' && <Shirt className="w-3.5 h-3.5" />}
                  {cat === 'All' && <Store className="w-3.5 h-3.5" />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>
              Showing <strong className="text-slate-200">{processedShops.length}</strong> shops
            </span>
            <button
              onClick={fetchShops}
              title="Refresh List"
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* SHOP CARDS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-64 animate-pulse"
              />
            ))}
          </div>
        ) : processedShops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedShops.map((shop) => (
              <ShopCard
                key={shop.id}
                id={shop.id}
                name={shop.name}
                category={shop.category}
                address={shop.address}
                phone={shop.phone}
                latitude={shop.latitude}
                longitude={shop.longitude}
                isVerified={shop.isVerified}
                isPromoted={shop.isPromoted}
                products={shop.products}
                distanceKm={shop.distanceKm}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
            <MapPin className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="font-bold text-slate-200 text-lg">No Shops Found</h3>
            <p className="text-xs text-slate-400">
              No matching stores or products found for &quot;{searchQuery || selectedCategory}&quot;. Try selecting another category or clear your search query.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="inline-block mt-2 bg-emerald-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
