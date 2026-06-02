'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddProductModal from '../components/AddProductModal';

const API_BASE_URL = 'https://backenddummy.railway.internal/api';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

interface Order {
  id: number;
  product_id: number;
  buyer_name: string;
  quantity: number;
  total_price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  product?: Product;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const router = useRouter();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch orders and products in parallel
      const [ordersRes, productsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/orders`),
        fetch(`${API_BASE_URL}/products`)
      ]);

      if (!ordersRes.ok) throw new Error('Gagal mengambil data pesanan.');
      if (!productsRes.ok) throw new Error('Gagal mengambil data produk.');

      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();

      setOrders(ordersData);
      setProducts(productsData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Koneksi ke backend server gagal.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if the user is authenticated as admin
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      setIsCheckingAuth(false);
      fetchData();
    }
  }, [router]);

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Gagal memperbarui status pesanan.');

      // Optimistically update status in state to avoid loading flash
      setOrders(prev =>
        prev.map(order => (order.id === orderId ? { ...order, status: newStatus } : order))
      );
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status.');
    }
  };

  // Helper: Format price to IDR (Rupiah)
  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Helper: Format timestamps beautifully
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Calculate Metrics
  const totalRevenue = orders
    .filter(order => order.status === 'Completed')
    .reduce((sum, order) => sum + order.total_price, 0);

  const pendingRevenue = orders
    .filter(order => order.status === 'Pending')
    .reduce((sum, order) => sum + order.total_price, 0);

  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;

  // Filtered orders list
  const filteredOrders = filterStatus === 'All'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center gap-4 relative selection:bg-violet-600/30 selection:text-violet-200">
        <div className="absolute top-0 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-violet-900/10 blur-[150px]" />
        <div className="h-10 w-10 rounded-full border-4 border-zinc-800 border-t-violet-500 animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest text-violet-400 animate-pulse">Memverifikasi Hak Akses Admin...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-violet-600/30 selection:text-violet-200">

      {/* Background glow ambient effects */}
      <div className="absolute top-0 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-violet-900/10 blur-[150px]" />
      <div className="absolute bottom-10 left-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-fuchsia-900/10 blur-[180px]" />

      {/* Header Section */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-black/70 backdrop-blur-xl transition-all">
        <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-6 sm:px-8">

          {/* Logo & Admin Branding */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-600/20">
              <span className="text-lg font-black text-white">A</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                Marketplace AA
              </span>
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest leading-none">
                Admin Console
              </span>
            </div>
          </div>

          {/* Navigation Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-violet-600/20 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>+ Tambah Barang</span>
            </button>

            <a
              href="/"
              className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-xs font-bold text-neutral-300 hover:bg-white hover:text-black transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Kembali ke Katalog</span>
            </a>

            <button
              onClick={() => {
                localStorage.removeItem('isLoggedIn');
                router.push('/login');
              }}
              className="flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/5 px-5 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-300 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8">

        {/* Title Block */}
        <div className="mb-10">
          <span className="rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-1.5 text-[10px] font-semibold tracking-wider text-fuchsia-400 uppercase">
            📊 REAL-TIME STORE OVERVIEW
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Dashboard Penjualan
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Kelola transaksi masuk, pantau performa omset toko, dan perbarui status pesanan pembeli secara real-time.
          </p>
        </div>

        {/* Loading and Error states */}
        {isLoading && orders.length === 0 ? (
          <div className="flex h-80 w-full flex-col items-center justify-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
            <p className="text-sm text-neutral-400">Memuat data dashboard...</p>
          </div>
        ) : error ? (
          <div className="flex h-80 w-full flex-col items-center justify-center rounded-3xl border border-red-500/10 bg-red-500/5 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">Gagal Memuat Dashboard</h3>
            <p className="mt-2 max-w-sm text-sm text-neutral-400">
              {error}. Pastikan database dan server backend (Port 4000) sudah aktif.
            </p>
            <button
              onClick={fetchData}
              className="mt-6 rounded-xl border border-white/20 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/5 transition-colors"
            >
              Hubungkan Ulang
            </button>
          </div>
        ) : (
          <>
            {/* KPI Performance Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">

              {/* Card 1: Revenue */}
              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-md transition-all duration-300 hover:border-violet-500/30 hover:bg-white/[0.04]">
                <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-emerald-500/5 blur-xl group-hover:bg-emerald-500/10 transition-colors" />
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Pendapatan Sukses</p>
                <h3 className="mt-2 text-2xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-500">
                  {formatRupiah(totalRevenue)}
                </h3>
                <p className="mt-1 text-[10px] text-neutral-500">
                  Dari pesanan berstatus <span className="text-emerald-400 font-bold">Completed</span>
                </p>
              </div>

              {/* Card 2: Pending Revenue */}
              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-md transition-all duration-300 hover:border-violet-500/30 hover:bg-white/[0.04]">
                <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-amber-500/5 blur-xl group-hover:bg-amber-500/10 transition-colors" />
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Omset Tertunda (Pending)</p>
                <h3 className="mt-2 text-2xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">
                  {formatRupiah(pendingRevenue)}
                </h3>
                <p className="mt-1 text-[10px] text-neutral-500">
                  Potensi dana dari pesanan baru masuk
                </p>
              </div>

              {/* Card 3: Orders Count */}
              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-md transition-all duration-300 hover:border-violet-500/30 hover:bg-white/[0.04]">
                <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-violet-500/5 blur-xl group-hover:bg-violet-500/10 transition-colors" />
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Total Transaksi</p>
                <h3 className="mt-2 text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                  {totalOrdersCount} <span className="text-sm font-medium text-neutral-500">Pesanan</span>
                </h3>
                <p className="mt-1 text-[10px] text-neutral-500">
                  Seluruh riwayat pesanan pelanggan
                </p>
              </div>

              {/* Card 4: Total Products */}
              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-md transition-all duration-300 hover:border-violet-500/30 hover:bg-white/[0.04]">
                <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-fuchsia-500/5 blur-xl group-hover:bg-fuchsia-500/10 transition-colors" />
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Total Produk</p>
                <h3 className="mt-2 text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-pink-500">
                  {totalProductsCount} <span className="text-sm font-medium text-neutral-500">Item</span>
                </h3>
                <p className="mt-1 text-[10px] text-neutral-500">
                  Jumlah produk aktif dalam katalog
                </p>
              </div>
            </div>

            {/* Orders Section Title & Filter Tabs */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Daftar Pesanan Masuk</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Menampilkan {filteredOrders.length} dari {totalOrdersCount} total transaksi
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1.5 self-start">
                {['All', 'Pending', 'Completed', 'Cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`rounded-lg px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${filterStatus === status
                      ? 'bg-white text-black font-bold shadow-md shadow-white/5'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {status === 'All' ? 'Semua' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Data Table */}
            <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-neutral-900/40 backdrop-blur-xl shadow-2xl">
              {filteredOrders.length === 0 ? (
                <div className="flex h-60 w-full flex-col items-center justify-center p-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-neutral-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h4 className="mt-4 font-bold text-white text-base">Tidak Ada Transaksi</h4>
                  <p className="mt-1 text-xs text-neutral-500 max-w-xs">
                    Tidak ditemukan data pesanan dengan status "{filterStatus === 'All' ? 'Semua' : filterStatus}" saat ini.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06] bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        <th className="px-6 py-4.5">ID</th>
                        <th className="px-6 py-4.5">Pembeli</th>
                        <th className="px-6 py-4.5">Produk</th>
                        <th className="px-6 py-4.5 text-center">Qty</th>
                        <th className="px-6 py-4.5">Total Harga</th>
                        <th className="px-6 py-4.5">Tanggal Order</th>
                        <th className="px-6 py-4.5 text-center">Status</th>
                        <th className="px-6 py-4.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {filteredOrders.map(order => (
                        <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">

                          {/* Order ID */}
                          <td className="px-6 py-4 font-mono text-xs text-neutral-500">
                            #{order.id}
                          </td>

                          {/* Buyer name */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10 text-violet-400 font-bold text-xs">
                                {order.buyer_name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-bold text-white">{order.buyer_name}</span>
                            </div>
                          </td>

                          {/* Product Details */}
                          <td className="px-6 py-4">
                            {order.product ? (
                              <div className="flex items-center gap-3">
                                <img
                                  src={order.product.image_url}
                                  alt={order.product.name}
                                  className="h-10 w-10 rounded-xl object-cover border border-white/10 bg-neutral-800"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600';
                                  }}
                                />
                                <div className="flex flex-col">
                                  <span className="font-semibold text-neutral-200 line-clamp-1 max-w-[200px]">{order.product.name}</span>
                                  <span className="text-[10px] text-neutral-500 font-medium">{formatRupiah(order.product.price)} / pcs</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-red-400 font-semibold italic text-xs">Produk Dihapus</span>
                            )}
                          </td>

                          {/* Quantity */}
                          <td className="px-6 py-4 text-center font-bold text-neutral-300">
                            {order.quantity}
                          </td>

                          {/* Total Price */}
                          <td className="px-6 py-4">
                            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                              {formatRupiah(order.total_price)}
                            </span>
                          </td>

                          {/* Date Ordered */}
                          <td className="px-6 py-4 text-xs text-neutral-400 font-medium">
                            {formatDate(order.createdAt)}
                          </td>

                          {/* Status Badge */}
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${order.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : order.status === 'Cancelled'
                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}>
                              {order.status}
                            </span>
                          </td>

                          {/* Interactive Action buttons */}
                          <td className="px-6 py-4 text-right">
                            {order.status === 'Pending' ? (
                              <div className="flex justify-end items-center gap-1.5">
                                <button
                                  onClick={() => handleUpdateStatus(order.id, 'Completed')}
                                  className="flex items-center justify-center rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors"
                                  title="Tandai Selesai"
                                >
                                  Selesai
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(order.id, 'Cancelled')}
                                  className="flex items-center justify-center rounded-xl bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                                  title="Batalkan Pesanan"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-neutral-600 italic">No Actions</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/[0.04] bg-neutral-950/50 py-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-neutral-500 sm:px-8">
          <p>© 2026 Marketplace Console Admin. All rights reserved. Created autonomously.</p>
        </div>
      </footer>

      {/* Product Creation Modal */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={fetchData}
      />
    </div>
  );
}
