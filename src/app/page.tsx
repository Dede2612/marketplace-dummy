'use client';

import React, { useState, useEffect } from 'react';
import ProductCard, { Product } from './components/ProductCard';
import AddProductModal from './components/AddProductModal';
import BuyProductModal from './components/BuyProductModal';

const API_BASE_URL = 'https://backenddummy-production-9b1f.up.railway.app/api';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [selectedProductForBuy, setSelectedProductForBuy] = useState<Product | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError('');
      const res = await fetch(`${API_BASE_URL}/products`);
      if (!res.ok) throw new Error('Gagal mengambil data produk dari server.');
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Koneksi ke backend server gagal.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Check if user is logged in as admin
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsAdmin(loggedIn);
  }, []);

  // Handle Delete
  const handleDeleteProduct = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Gagal menghapus produk.');
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (err: any) {
        alert(err.message || 'Gagal menghapus produk.');
      }
    }
  };

  // Handle Buy / Checkout action
  const handleBuyProduct = (product: Product) => {
    setSelectedProductForBuy(product);
    setIsBuyModalOpen(true);
  };

  // Filter products by search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative selection:bg-indigo-100 selection:text-indigo-900">

      {/* Header Section */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-6 sm:px-8">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-md shadow-indigo-600/10">
              <span className="text-lg font-black text-white">M</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600">
              Marketplace AA
            </span>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex relative w-80">
            <input
              type="text"
              placeholder="Cari produk impian Anda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 pl-11 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-3 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <a
              href="/admin"
              className="flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-5 py-2.5 text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
              <span>Dashboard Admin</span>
            </a>

            {isAdmin && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all shadow-md shadow-slate-950/10 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>Tambah Barang</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden py-16 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 flex flex-col items-center text-center">
          <span className="rounded-full bg-indigo-50 px-4 py-1.5 text-[11px] font-semibold tracking-wider text-indigo-600 uppercase">
            ⚡ NEW ARRIVALS & TRENDING PRODUCTS ⚡
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight text-slate-900">
            Temukan Produk Pilihan Terbaik Dengan Harga Bersahabat
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-slate-500">
            Belanja praktis, cepat, dan aman dari katalog e-commerce premium terlengkap. Rasakan kemudahan berbelanja secara instan dengan tampilan baru yang menyegarkan mata.
          </p>
        </div>
      </section>

      {/* Main Catalog View */}
      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Katalog Unggulan</h2>
          <p className="mt-1 text-xs text-slate-400">
            {filteredProducts.length} Produk ditemukan
          </p>
        </div>

        {/* Loading and Error Handling */}
        {isLoading ? (
          <div className="flex h-60 w-full flex-col items-center justify-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
            <p className="text-xs text-slate-400">Memuat data katalog...</p>
          </div>
        ) : error ? (
          <div className="flex h-80 w-full flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center">
            <h3 className="text-md font-bold text-red-600">Koneksi Server Gagal</h3>
            <p className="mt-2 max-w-xs text-xs text-slate-400">{error}</p>
            <button onClick={fetchProducts} className="mt-4 rounded-lg bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Coba Lagi</button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex h-60 w-full flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-8 text-center">
            <h3 className="text-md font-bold text-slate-700">Produk Tidak Ditemukan</h3>
            <button onClick={() => setSearchTerm('')} className="mt-4 rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700">Reset Pencarian</button>
          </div>
        ) : (
          /* Grid Layout */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isAdmin={isAdmin}
                onEdit={() => alert("Gunakan fitur edit langsung melalui database atau kembangkan dashboard admin")}
                onDelete={handleDeleteProduct}
                onBuy={handleBuyProduct}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer Section */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-xs text-slate-400 sm:px-8">
          <p>© 2026 Marketplace AA Premium. All rights reserved.</p>
        </div>
      </footer>

      {/* Interactive Modal */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={fetchProducts}
      />

      {/* Buy Product Modal */}
      <BuyProductModal
        isOpen={isBuyModalOpen}
        product={selectedProductForBuy}
        onClose={() => {
          setIsBuyModalOpen(false);
          setSelectedProductForBuy(null);
        }}
        onBuySuccess={fetchProducts}
      />
    </div>
  );
}