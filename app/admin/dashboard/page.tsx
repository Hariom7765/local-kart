'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { ShopModal } from '@/components/ShopModal';
import { ProductModal } from '@/components/ProductModal';
import {
  Store,
  Package,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  BadgeCheck,
  CheckCircle2,
  XCircle,
  LogOut,
  ShoppingBag,
  Stethoscope,
  Laptop,
  Shirt,
  Search,
} from 'lucide-react';

interface Product {
  id: string;
  shopId: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  imageUrl?: string | null;
  shop?: {
    name: string;
    category: string;
  };
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

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'shops' | 'products'>('shops');
  const [query, setQuery] = useState('');

  // Modals state
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch initial dashboard data
  const loadData = async () => {
    setLoading(true);
    try {
      const [shopsRes, prodRes] = await Promise.all([
        fetch('/api/shops'),
        fetch('/api/products'),
      ]);

      if (shopsRes.ok) {
        const shopsData = await shopsRes.json();
        setShops(shopsData);
      }

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute KPIs
  const totalShops = shops.length;
  const totalProducts = products.length;
  const totalPromoted = shops.filter((s) => s.isPromoted).length;
  const totalVerified = shops.filter((s) => s.isVerified).length;

  // Toggle Shop Promoted Status Inline
  const handleTogglePromoted = async (shop: Shop) => {
    try {
      const res = await fetch(`/api/shops/${shop.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPromoted: !shop.isPromoted }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error('Error toggling promoted status:', err);
    }
  };

  // Toggle Shop Verified Status Inline
  const handleToggleVerified = async (shop: Shop) => {
    try {
      const res = await fetch(`/api/shops/${shop.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !shop.isVerified }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error('Error toggling verified status:', err);
    }
  };

  // Toggle Product Stock Status Inline
  const handleToggleStock = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !product.inStock }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error('Error toggling stock status:', err);
    }
  };

  // Delete Shop
  const handleDeleteShop = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`))
      return;
    try {
      const res = await fetch(`/api/shops/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error('Error deleting shop:', err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete product "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Save Shop (Create or Edit)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveShop = async (shopData: any) => {
    const isEdit = Boolean(shopData.id);
    const url = isEdit ? `/api/shops/${shopData.id}` : '/api/shops';
    const method = isEdit ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shopData),
    });

    if (res.ok) {
      loadData();
    } else {
      alert('Failed to save shop. Check input parameters.');
    }
  };

  // Save Product (Create or Edit)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveProduct = async (productData: any) => {
    const isEdit = Boolean(productData.id);
    const url = isEdit ? `/api/products/${productData.id}` : '/api/products';
    const method = isEdit ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    if (res.ok) {
      loadData();
    } else {
      alert('Failed to save product.');
    }
  };

  const filteredShops = shops.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.category.toLowerCase().includes(query.toLowerCase()) ||
      s.address.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-16 bg-slate-950">
      {/* DASHBOARD TOP HEADER */}
      <section className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
              <Store className="w-6 h-6 text-emerald-400" />
              <span>Admin Management Dashboard</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Logged in as <strong className="text-slate-200">{session?.user?.name || 'Admin'}</strong> ({session?.user?.email})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedShop(null);
                setIsShopModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" /> Add Shop
            </button>

            <button
              onClick={() => {
                setSelectedProduct(null);
                setIsProductModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>

            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              title="Sign Out Admin"
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* SUMMARY KPI CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Total Shops</p>
              <p className="text-2xl font-black text-slate-100">{totalShops}</p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Total Products</p>
              <p className="text-2xl font-black text-slate-100">{totalProducts}</p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Featured Listings</p>
              <p className="text-2xl font-black text-slate-100">{totalPromoted}</p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Verified Stores</p>
              <p className="text-2xl font-black text-slate-100">{totalVerified}</p>
            </div>
          </div>
        </div>

        {/* TAB CONTROLS & FILTER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('shops')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'shops'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Store className="w-4 h-4" /> Shops ({shops.length})
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'products'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-4 h-4" /> Products ({products.length})
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Filter ${activeTab}...`}
              className="bg-slate-900 border border-slate-800 focus:border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none w-full sm:w-64"
            />
          </div>
        </div>

        {/* DATA TABLES */}
        {loading ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl h-64 animate-pulse" />
        ) : activeTab === 'shops' ? (
          /* SHOPS TABLE */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Shop Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Address</th>
                    <th className="p-4 text-center">Verified</th>
                    <th className="p-4 text-center">Featured</th>
                    <th className="p-4 text-center">Items</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredShops.map((shop) => (
                    <tr key={shop.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-slate-100">{shop.name}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                          {shop.category === 'Kirana' && <ShoppingBag className="w-3 h-3 text-emerald-400" />}
                          {shop.category === 'Medical' && <Stethoscope className="w-3 h-3 text-rose-400" />}
                          {shop.category === 'Electronics' && <Laptop className="w-3 h-3 text-cyan-400" />}
                          {shop.category === 'Fashion' && <Shirt className="w-3 h-3 text-purple-400" />}
                          {shop.category}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-300">{shop.phone}</td>
                      <td className="p-4 max-w-xs truncate">{shop.address}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleVerified(shop)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                            shop.isVerified
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}
                        >
                          <BadgeCheck className="w-3.5 h-3.5" />
                          <span>{shop.isVerified ? 'Yes' : 'No'}</span>
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleTogglePromoted(shop)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                            shop.isPromoted
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{shop.isPromoted ? 'Promoted' : 'Standard'}</span>
                        </button>
                      </td>
                      <td className="p-4 text-center font-bold text-slate-200">
                        {shop.products?.length || 0}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedShop(shop);
                              setIsShopModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="Edit Shop"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteShop(shop.id, shop.name)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                            title="Delete Shop"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* PRODUCTS TABLE */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price (₹)</th>
                    <th className="p-4">Shop Name</th>
                    <th className="p-4 text-center">Stock Toggle</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-slate-100">{prod.name}</td>
                      <td className="p-4">{prod.category}</td>
                      <td className="p-4 font-bold text-emerald-400">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 text-slate-300 font-medium">
                        {prod.shop?.name || 'Assigned Shop'}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleStock(prod)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                            prod.inStock
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {prod.inStock ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" /> Out of Stock
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedProduct(prod);
                              setIsProductModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* SHOP MODAL */}
      <ShopModal
        isOpen={isShopModalOpen}
        onClose={() => setIsShopModalOpen(false)}
        onSave={handleSaveShop}
        initialData={selectedShop}
      />

      {/* PRODUCT MODAL */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        shops={shops}
        initialData={selectedProduct}
      />
    </div>
  );
}
