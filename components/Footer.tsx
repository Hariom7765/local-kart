import Link from 'next/link';
import { Store, Heart, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Store className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-100 text-lg">Local Cart AI</span>
          </div>
          <p className="text-sm text-slate-400 max-w-sm">
            Empowering neighborhood Kirana, Medical, Electronics, and Fashion retailers with AI-enabled hyper-local discovery for nearby customers.
          </p>
          <div className="inline-flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI-Driven Dynamic Distance & Inventory Search</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 mb-3 text-sm">Categories</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/?category=Kirana" className="hover:text-emerald-400 transition-colors">Kirana & Provisions</Link></li>
            <li><Link href="/?category=Medical" className="hover:text-emerald-400 transition-colors">Medical & Pharmacy</Link></li>
            <li><Link href="/?category=Electronics" className="hover:text-emerald-400 transition-colors">Electronics & Accessories</Link></li>
            <li><Link href="/?category=Fashion" className="hover:text-emerald-400 transition-colors">Fashion & Garments</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 mb-3 text-sm">Admin Access</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/admin/login" className="hover:text-emerald-400 transition-colors">Admin Login</Link></li>
            <li><Link href="/admin/dashboard" className="hover:text-emerald-400 transition-colors">Shop & Inventory Portal</Link></li>
            <li className="pt-2 text-[11px] text-slate-500">
              Credentials: <span className="text-emerald-400">hariom7765</span> / <span className="text-emerald-400">admin</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>© 2026 Local Cart AI. Connecting Local Retailers with Nearby Buyers.</p>
        <p className="flex items-center gap-1 text-slate-500">
          Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian Neighborhood Shops
        </p>
      </div>
    </footer>
  );
}
