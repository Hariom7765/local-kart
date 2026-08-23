'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Store,
  Package,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Layers,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Stethoscope,
  Laptop,
  Shirt,
  Search,
} from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  shopId: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  stockQuantity: number;
  description?: string | null;
  imageUrl?: string | null;
  createdAt: string;
}

interface Shop {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
}

export default function ShopkeeperDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Add/Edit Product Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Kirana');
  const [price, setPrice] = useState<number | ''>('');
  const [stockQuantity, setStockQuantity] = useState<number | ''>(10);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-hide toast messages
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Load Inventory Data
  const loadInventory = async () => {
    setLoading(true);
    let apiShop: Shop | null = null;
    let apiProducts: Product[] = [];

    try {
      const res = await fetch('/api/shopkeeper/inventory');
      if (res.ok) {
        const data = await res.json();
        apiShop = data.shop || null;
        apiProducts = data.products || [];
      }
    } catch (err) {
      console.error('Failed to load inventory from API:', err);
    }

    // Check localStorage for offline/resilient local products
    let localProducts: Product[] = [];
    try {
      const saved = localStorage.getItem('user_inventory_products');
      if (saved) {
        localProducts = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading localStorage inventory products:', e);
    }

    // Merge API and local products, eliminating duplicates
    const mergedMap = new Map<string, Product>();
    localProducts.forEach((p) => mergedMap.set(p.id, p));
    apiProducts.forEach((p) => mergedMap.set(p.id, p));
    const merged = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    // Fallback default shop instance if shop is not set
    const fallbackShop: Shop = apiShop || {
      id: 'shop-auto-1',
      name: 'My Retail Store',
      category: 'Kirana',
      address: 'Local Market',
      phone: '+91 9876543210',
    };

    setShop(fallbackShop);
    setProducts(merged);
    setLoading(false);
  };

  useEffect(() => {
    if (status === 'authenticated') {
      loadInventory();
    } else if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Image File Upload Handler with Data URL preview
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setToastMessage({ type: 'error', text: 'Please select a valid image file (JPG/PNG).' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset Form
  const resetForm = () => {
    setEditingProduct(null);
    setName('');
    setCategory('Kirana');
    setPrice('');
    setStockQuantity(10);
    setDescription('');
    setImageUrl('');
    setImagePreview(null);
  };

  // Populate form for Edit action
  const handleStartEdit = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setCategory(prod.category);
    setPrice(prod.price);
    setStockQuantity(prod.stockQuantity ?? 10);
    setDescription(prod.description || '');
    setImageUrl(prod.imageUrl || '');
    setImagePreview(prod.imageUrl || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Product Form (Create or Edit)
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setToastMessage({ type: 'error', text: 'Product name is required.' });
      return;
    }
    if (price === '' || Number(price) <= 0) {
      setToastMessage({ type: 'error', text: 'Please enter a valid price in ₹.' });
      return;
    }

    setFormSubmitting(true);

    const effectiveShopId = shop?.id || 'shop-auto-1';
    const isEdit = Boolean(editingProduct);
    const prodId = editingProduct?.id || 'prod-' + Date.now();

    const newProd: Product = {
      id: prodId,
      shopId: effectiveShopId,
      name: name.trim(),
      category,
      price: Number(price),
      stockQuantity: stockQuantity === '' ? 10 : Number(stockQuantity),
      inStock: (stockQuantity === '' ? 10 : Number(stockQuantity)) > 0,
      description: description.trim() || null,
      imageUrl: imageUrl || imagePreview || null,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
    };

    // 1. Immediately update local state & localStorage for instant feedback
    try {
      let savedLocal: Product[] = [];
      const savedStr = localStorage.getItem('user_inventory_products');
      if (savedStr) savedLocal = JSON.parse(savedStr);

      if (isEdit) {
        savedLocal = savedLocal.map((p) => (p.id === prodId ? newProd : p));
      } else {
        savedLocal = [newProd, ...savedLocal];
      }
      localStorage.setItem('user_inventory_products', JSON.stringify(savedLocal));
    } catch (err) {
      console.error('Error writing product to localStorage:', err);
    }

    // Update UI state immediately
    setProducts((prev) => {
      if (isEdit) {
        return prev.map((p) => (p.id === prodId ? newProd : p));
      }
      return [newProd, ...prev.filter((p) => p.id !== prodId)];
    });

    setToastMessage({
      type: 'success',
      text: isEdit
        ? `Product "${name}" updated successfully!`
        : `Product "${name}" published to live store!`,
    });

    resetForm();

    // 2. Fire background API call
    try {
      const url = isEdit ? `/api/products/${prodId}` : '/api/products';
      const method = isEdit ? 'PATCH' : 'POST';

      const payload = {
        shopId: effectiveShopId,
        shopName: shop?.name || 'My Retail Store',
        shopAddress: shop?.address || 'Local Market',
        shopPhone: shop?.phone || '+91 9876543210',
        name: name.trim(),
        category,
        price: Number(price),
        stockQuantity: stockQuantity === '' ? 10 : Number(stockQuantity),
        inStock: (stockQuantity === '' ? 10 : Number(stockQuantity)) > 0,
        description: description.trim() || null,
        imageUrl: imageUrl || imagePreview || null,
      };

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error('Background product save error (using resilient offline storage):', err);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!confirm(`Are you sure you want to delete "${prodName}" from inventory?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMessage({ type: 'success', text: `Product "${prodName}" removed.` });
        loadInventory();
      } else {
        setToastMessage({ type: 'error', text: 'Failed to delete product.' });
      }
    } catch (err) {
      console.error('Delete product error:', err);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockCount = products.filter((p) => (p.stockQuantity ?? 0) < 5).length;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-emerald-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-sm font-medium">Loading Shopkeeper Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
                : 'bg-rose-950/90 border-rose-500 text-rose-300'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* DASHBOARD TOP HEADER */}
      <section className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Store Discovery
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
              <Store className="w-6 h-6 text-emerald-400" />
              <span>{shop?.name || 'Shopkeeper Inventory Portal'}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Store Category: <span className="text-emerald-400 font-semibold">{shop?.category || 'Retail'}</span> •{' '}
              Address: <span className="text-slate-300">{shop?.address || 'Local Market'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/shop/${shop?.id || 'demo'}`}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" /> View Public Storefront
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* SUMMARY STATS & LOW STOCK ALERT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Total Active Items</p>
              <p className="text-2xl font-black text-slate-100">{products.length}</p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Low Stock Alert (&lt; 5 items)</p>
              <p className="text-2xl font-black text-amber-400">{lowStockCount}</p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Store Status</p>
              <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-4 h-4" /> Live &amp; Discoverable
              </p>
            </div>
          </div>
        </div>

        {/* ADD / EDIT PRODUCT FORM */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>{editingProduct ? 'Edit Inventory Item' : 'Add New Product to Store'}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {editingProduct
                  ? 'Update price, stock level, or details for this item.'
                  : 'Newly uploaded products appear instantly in public search & store listings.'}
              </p>
            </div>
            {editingProduct && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-slate-400 hover:text-rose-400 border border-slate-700 bg-slate-800 px-3 py-1.5 rounded-xl transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmitProduct} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Product Name */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Product Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Package className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aashirvaad Whole Wheat Atta 5kg"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Category <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-100 focus:outline-none appearance-none"
                  >
                    <option value="Kirana">Kirana &amp; Provisions</option>
                    <option value="Medical">Medical &amp; Pharmacy</option>
                    <option value="Electronics">Electronics &amp; Mobiles</option>
                    <option value="Fashion">Fashion &amp; Apparel</option>
                  </select>
                </div>
              </div>

              {/* Price in ₹ */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Price in ₹ <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold text-sm select-none">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min={0}
                    step="0.5"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="245.00"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stock Quantity */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Stock Quantity (units/kg/packets) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="number"
                    required
                    min={0}
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                    placeholder="10"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Short Description / Weight / Volume */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Short Description / Weight / Volume (Optional)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 5kg Pack, 100% Whole Wheat, Fresh Stock"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Product Image Upload / Picker */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Product Image (Upload File or Enter Image URL)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* File picker */}
                <div>
                  <label className="flex items-center gap-2 justify-center px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs font-semibold text-slate-300 transition-colors">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>Choose Image File (JPG/PNG)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Fallback URL input */}
                <div>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreview(e.target.value || null);
                    }}
                    placeholder="Or paste image URL (https://...)"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Preview Card */}
              {imagePreview && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 w-max mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg border border-slate-800"
                  />
                  <div className="text-xs">
                    <p className="text-slate-200 font-semibold">Image Selected</p>
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageUrl('');
                      }}
                      className="text-[11px] text-rose-400 hover:underline"
                    >
                      Remove image
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {editingProduct && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={formSubmitting}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {formSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingProduct ? 'Update Product' : 'Publish Product'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ACTIVE INVENTORY TABLE */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-4">
          <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <span>Active Store Inventory</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage stock counts, prices, and status for items in your store.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventory..."
                className="bg-slate-900 border border-slate-800 focus:border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none w-full sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Product Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price (₹)</th>
                  <th className="p-4 text-center">Stock Quantity &amp; Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No inventory items found. Add your first product using the form above!
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => {
                    const isLowStock = (prod.stockQuantity ?? 0) < 5;
                    const isOutOfStock = (prod.stockQuantity ?? 0) <= 0 || !prod.inStock;

                    return (
                      <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                        {/* Thumbnail & Title */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {prod.imageUrl ? (
                              <img
                                src={prod.imageUrl}
                                alt={prod.name}
                                className="w-12 h-12 object-cover rounded-xl border border-slate-800 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700">
                                <Package className="w-6 h-6" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-slate-100 text-sm">{prod.name}</p>
                              {prod.description && (
                                <p className="text-[11px] text-slate-400 max-w-xs truncate">
                                  {prod.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                            {prod.category === 'Kirana' && <ShoppingBag className="w-3 h-3 text-emerald-400" />}
                            {prod.category === 'Medical' && <Stethoscope className="w-3 h-3 text-rose-400" />}
                            {prod.category === 'Electronics' && <Laptop className="w-3 h-3 text-cyan-400" />}
                            {prod.category === 'Fashion' && <Shirt className="w-3 h-3 text-purple-400" />}
                            {prod.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="p-4 font-bold text-emerald-400 text-sm font-mono">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </td>

                        {/* Stock Count & Low-Stock Badge */}
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-extrabold text-slate-100 font-mono text-sm">
                              {prod.stockQuantity ?? 10} units
                            </span>

                            {isOutOfStock ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                                Out of Stock
                              </span>
                            ) : isLowStock ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold animate-pulse">
                                <AlertTriangle className="w-3 h-3" /> Low Stock (&lt; 5 left)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3" /> In Stock
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleStartEdit(prod)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
