'use client';

import { useCart } from '@/context/CartContext';
import { MessageSquare, CheckCircle2, XCircle, Plus } from 'lucide-react';

interface ProductCardProps {
  id?: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  imageUrl?: string | null;
  shopId: string;
  shopName: string;
  shopPhone: string;
}

export function ProductCard({
  id = 'prod-' + Math.random(),
  name,
  category,
  price,
  inStock,
  imageUrl,
  shopId,
  shopName,
  shopPhone,
}: ProductCardProps) {
  const { addItem } = useCart();
  const cleanPhone = shopPhone.replace(/[^0-9]/g, '');
  const whatsappMsg = `Hi ${shopName}, I am checking availability for "${name}" (₹${price}) listed on Local Cart AI.`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`;

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem({
      id,
      name,
      category,
      price,
      imageUrl,
      shopId,
      shopName,
      shopPhone,
    });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 group">
      <div>
        {/* Product Image */}
        <div className="relative w-full h-36 rounded-xl bg-slate-950 overflow-hidden mb-3 border border-slate-800/80">
          {imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900 text-xs">
              No Image Available
            </div>
          )}

          {/* Stock Badge Overlay */}
          <div className="absolute top-2 right-2">
            {inStock ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/90 text-slate-950 backdrop-blur-sm shadow-md">
                <CheckCircle2 className="w-3 h-3" /> In Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/90 text-white backdrop-blur-sm shadow-md">
                <XCircle className="w-3 h-3" /> Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Category Pill */}
        <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
          {category}
        </span>

        {/* Product Name */}
        <h4 className="font-semibold text-slate-100 text-sm mt-0.5 line-clamp-2 leading-snug">
          {name}
        </h4>
      </div>

      {/* Price & Actions */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
        <div>
          <span className="text-xs text-slate-400 block -mb-1">Price</span>
          <span className="text-base font-bold text-emerald-400">
            ₹{price.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Ask Stock on WhatsApp"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-md ${
              inStock
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 active:scale-95'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
