'use client';

import { useCart } from '@/context/CartContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Store,
} from 'lucide-react';

export function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeItem,
    clearCart,
    totalPrice,
    totalItems,
    shopInfo,
  } = useCart();

  if (!isOpen) return null;

  // Format WhatsApp Message Payload
  const generateWhatsAppUrl = () => {
    if (!shopInfo || items.length === 0) return '#';

    const cleanPhone = (
      process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP_PHONE || shopInfo.phone
    ).replace(/[^0-9]/g, '');

    const lines = [
      `🛒 *NEW ORDER VIA LOCAL CART AI*`,
      `----------------------------------`,
      `🏪 *Store:* ${shopInfo.name}`,
      `📱 *Contact:* ${shopInfo.phone}`,
      ``,
      `📋 *ITEMIZED RECEIPT:*`,
    ];

    items.forEach((item, index) => {
      const lineTotal = item.price * item.quantity;
      lines.push(
        `${index + 1}. *${item.name}*`,
        `   Qty: ${item.quantity}  |  Price: ₹${item.price}  |  Total: ₹${lineTotal}`
      );
    });

    lines.push(
      ``,
      `----------------------------------`,
      `💰 *GRAND TOTAL:* ₹${totalPrice.toLocaleString('en-IN')}`,
      `----------------------------------`,
      `📍 Please confirm item availability and estimated order pickup/delivery time!`
    );

    const fullText = lines.join('\n');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullText)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in">
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between text-slate-100 animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-base flex items-center gap-1.5">
                  <span>Your Local Cart</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {totalItems} items
                  </span>
                </h3>
                {shopInfo && (
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Store className="w-3 h-3 text-slate-500" />
                    <span>Ordering from: </span>
                    <strong className="text-slate-200">{shopInfo.name}</strong>
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
                <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-200 text-base">Your Cart is Empty</h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Browse nearby Kirana, Medical, Electronics, or Fashion stores and add items to your cart.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-3.5 flex items-center gap-3 group hover:border-slate-700 transition-all"
                >
                  {/* Item Image */}
                  {item.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 text-xs shrink-0 font-semibold">
                      Item
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 font-semibold uppercase text-[10px]">
                      {item.category}
                    </p>
                    <h5 className="text-xs font-bold text-slate-100 truncate">{item.name}</h5>
                    <p className="text-xs font-extrabold text-emerald-400 mt-0.5">
                      ₹{item.price.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] text-slate-500 font-normal">each</span>
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950/80 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Subtotal ({totalItems} items)</span>
                <span className="text-sm font-bold text-slate-100">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
                <span className="font-semibold text-slate-200">Grand Total</span>
                <span className="text-base font-black text-emerald-400">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold py-3 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Order via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <button
                  onClick={clearCart}
                  className="hover:text-rose-400 transition-colors"
                >
                  Clear Cart
                </button>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" /> Direct Merchant Dispatch
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
