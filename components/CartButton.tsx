'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingCart, Sparkles } from 'lucide-react';

export function CartButton() {
  const { totalItems, totalPrice, setIsOpen, isHydrated } = useCart();

  // Prevent SSR hydration mismatch render before client hydration finishes
  if (!isHydrated || totalItems === 0) return null;

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 bg-slate-900/95 hover:bg-slate-900 border border-emerald-500/50 hover:border-emerald-400 text-slate-100 px-4 py-3 rounded-2xl shadow-2xl shadow-emerald-500/20 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
    >
      <div className="relative">
        <ShoppingCart className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
        <span className="absolute -top-2.5 -right-2.5 bg-emerald-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md">
          {totalItems}
        </span>
      </div>

      <div className="text-left hidden sm:block">
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider -mb-0.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" /> Local Cart
        </p>
        <p className="text-xs font-extrabold text-slate-100">
          ₹{totalPrice.toLocaleString('en-IN')}
        </p>
      </div>
    </button>
  );
}
