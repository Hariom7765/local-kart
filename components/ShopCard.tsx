import Link from 'next/link';
import {
  BadgeCheck,
  MapPin,
  Phone,
  MessageSquare,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Stethoscope,
  Laptop,
  Shirt,
  Store,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

interface ShopCardProps {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  isVerified: boolean;
  isPromoted: boolean;
  products?: Product[];
  distanceKm?: number | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  Kirana: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medical: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Electronics: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Fashion: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

function getCategoryIcon(category: string) {
  switch (category) {
    case 'Kirana':
      return <ShoppingBag className="w-3.5 h-3.5" />;
    case 'Medical':
      return <Stethoscope className="w-3.5 h-3.5" />;
    case 'Electronics':
      return <Laptop className="w-3.5 h-3.5" />;
    case 'Fashion':
      return <Shirt className="w-3.5 h-3.5" />;
    default:
      return <Store className="w-3.5 h-3.5" />;
  }
}

export function ShopCard({
  id,
  name,
  category,
  address,
  phone,
  isVerified,
  isPromoted,
  products = [],
  distanceKm,
}: ShopCardProps) {
  const inStockProducts = products.filter((p) => p.inStock);
  const sampleProducts = inStockProducts.slice(0, 3);

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(
    name
  )},%20checking%20stock%20for%20products%20on%20Local%20Cart%20AI`;

  return (
    <div
      className={`group relative bg-slate-900/90 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        isPromoted
          ? 'border-amber-500/40 shadow-amber-500/5 hover:border-amber-500/60'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                CATEGORY_COLORS[category] || 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {getCategoryIcon(category)}
              {category}
            </span>

            {isVerified && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
                Verified
              </span>
            )}
          </div>

          {isPromoted && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-sm animate-pulse">
              <Sparkles className="w-3 h-3 fill-slate-950" />
              FEATURED
            </span>
          )}
        </div>

        {/* Shop Title */}
        <Link href={`/shop/${id}`} className="block group-hover:text-emerald-400 transition-colors">
          <h3 className="font-bold text-lg text-slate-100 leading-snug line-clamp-1">
            {name}
          </h3>
        </Link>

        {/* Address & Distance */}
        <div className="mt-2 space-y-1 text-xs text-slate-400">
          <div className="flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{address}</span>
          </div>

          {distanceKm !== undefined && distanceKm !== null && (
            <div className="inline-flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50 mt-1">
              <span>{distanceKm} km away from you</span>
            </div>
          )}
        </div>

        {/* Sample Stock Preview */}
        {sampleProducts.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <p className="text-[11px] font-medium text-slate-400 mb-2 flex items-center justify-between">
              <span>Live Stock Sample:</span>
              <span className="text-emerald-400 font-semibold text-[10px]">
                {inStockProducts.length} items in stock
              </span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sampleProducts.map((prod) => (
                <span
                  key={prod.id}
                  className="text-[11px] bg-slate-800/80 border border-slate-700/60 text-slate-300 px-2 py-0.5 rounded-md truncate max-w-[180px]"
                >
                  {prod.name} (₹{prod.price})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <a
            href={`tel:${phone}`}
            title="Call Shop"
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat on WhatsApp"
            className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition-colors border border-emerald-500/20"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </a>
        </div>

        <Link
          href={`/shop/${id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/10 active:scale-95"
        >
          <span>View Shop</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
