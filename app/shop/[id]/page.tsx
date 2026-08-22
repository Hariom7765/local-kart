'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import {
  Phone,
  MessageSquare,
  Navigation,
  BadgeCheck,
  MapPin,
  ArrowLeft,
  Search,
  Sparkles,
  ShoppingBag,
  Stethoscope,
  Laptop,
  Shirt,
  Store,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  imageUrl?: string | null;
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

export default function ShopProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [productQuery, setProductQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock'>('all');

  useEffect(() => {
    async function loadShop() {
      try {
        const res = await fetch(`/api/shops/${id}`);
        if (res.ok) {
          const data = await res.json();
          setShop(data);
        }
      } catch (err) {
        console.error('Error loading shop profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadShop();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 max-w-xl mx-auto animate-pulse space-y-4">
          <div className="h-8 bg-slate-800 rounded-xl w-3/4 mx-auto" />
          <div className="h-4 bg-slate-800 rounded-xl w-1/2 mx-auto" />
          <div className="h-10 bg-slate-800 rounded-2xl w-full mt-6" />
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Store className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-100">Shop Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested retail shop could not be found or has been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shops
        </Link>
      </div>
    );
  }

  // Filter products
  const filteredProducts = (shop.products || []).filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(productQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(productQuery.toLowerCase());
    const matchesStock = stockFilter === 'all' || prod.inStock;
    return matchesSearch && matchesStock;
  });

  const cleanPhone = shop.phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(
    shop.name
  )},%20checking%20stock%20availability%20for%20items%20on%20Local%20Cart%20AI`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`;

  return (
    <div className="min-h-screen pb-16">
      {/* SHOP BANNER HEADER */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800 px-4 sm:px-6 lg:px-8 pt-8 pb-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Nearby Shops
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {shop.category === 'Kirana' && <ShoppingBag className="w-3.5 h-3.5" />}
                  {shop.category === 'Medical' && <Stethoscope className="w-3.5 h-3.5" />}
                  {shop.category === 'Electronics' && <Laptop className="w-3.5 h-3.5" />}
                  {shop.category === 'Fashion' && <Shirt className="w-3.5 h-3.5" />}
                  {shop.category}
                </span>

                {shop.isVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verified Retailer
                  </span>
                )}

                {shop.isPromoted && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950">
                    <Sparkles className="w-3 h-3 fill-slate-950" /> FEATURED STORE
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100">
                {shop.name}
              </h1>

              <div className="flex items-start gap-2 text-sm text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{shop.address}</span>
              </div>
            </div>

            {/* ACTION BUTTONS: Call, WhatsApp, Directions */}
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={`tel:${shop.phone}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold px-4 py-3 rounded-xl border border-slate-700 transition-all text-xs sm:text-sm shadow-md"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Shop</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-3 rounded-xl transition-all text-xs sm:text-sm shadow-lg shadow-emerald-500/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Order</span>
              </a>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-3 rounded-xl transition-all text-xs sm:text-sm shadow-md shadow-indigo-600/20"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS CATALOG SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>Live Product Inventory</span>
              <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full font-semibold">
                {shop.products?.length || 0} Total Items
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Check live stock status and message retailer directly for pickup or delivery.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search items inside shop */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productQuery}
                onChange={(e) => setProductQuery(e.target.value)}
                placeholder="Search products in shop..."
                className="bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none w-48 sm:w-64"
              />
            </div>

            {/* Filter In Stock */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setStockFilter('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  stockFilter === 'all'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStockFilter('inStock')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  stockFilter === 'inStock'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                In Stock Only
              </button>
            </div>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                category={product.category}
                price={product.price}
                inStock={product.inStock}
                imageUrl={product.imageUrl}
                shopName={shop.name}
                shopPhone={shop.phone}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs max-w-md mx-auto space-y-2">
            <p className="font-semibold text-slate-300">No matching products found</p>
            <p>Try clearing your product search query or filter options.</p>
          </div>
        )}
      </section>
    </div>
  );
}
