'use client';

import React, { useState, useEffect } from 'react';
import { Product } from './ProductCard';

interface BuyProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onBuySuccess: () => void;
}

export default function BuyProductModal({ isOpen, product, onClose, onBuySuccess }: BuyProductModalProps) {
  const [buyerName, setBuyerName] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen) {
      setBuyerName('');
      setAddress('');
      setQuantity(1);
      setError('');
      setSuccessData(null);
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val <= 0) {
      setQuantity(1);
    } else if (val > product.stock) {
      setQuantity(product.stock);
    } else {
      setQuantity(val);
    }
  };

  // Helper: Format price to IDR
  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalCalculatedPrice = product.price * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      setError('Nama pembeli wajib diisi.');
      return;
    }
    if (!address.trim()) {
      setError('Alamat lengkap pengiriman wajib diisi.');
      return;
    }
    if (quantity <= 0) {
      setError('Jumlah pesanan tidak valid.');
      return;
    }
    if (quantity > product.stock) {
      setError('Stok produk tidak mencukupi.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('https://backenddummy-production-9b1f.up.railway.app/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          buyer_name: buyerName.trim(),
          quantity: quantity
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal melakukan transaksi pembelian.');
      }

      const orderResult = await res.json();

      // Simpan data sukses untuk dirender sebagai struk pembelian premium
      setSuccessData({
        orderId: orderResult.id,
        buyerName: buyerName.trim(),
        address: address.trim(),
        productName: product.name,
        quantity: quantity,
        totalPrice: totalCalculatedPrice
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Koneksi ke backend server gagal.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    onBuySuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">

      {/* Glow effect behind modal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[450px] w-[450px] rounded-full bg-violet-600/10 blur-[130px]" />

      <div className="bg-zinc-950 border border-white/[0.08] rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative transition-all duration-300">

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/[0.06] flex justify-between items-center bg-white/[0.01]">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-white">
              {successData ? '🛒 Pembelian Berhasil!' : '🛒 Formulir Pembelian'}
            </h3>
            {!successData && (
              <p className="text-[10px] text-neutral-400 mt-0.5 uppercase tracking-wider font-bold">
                Marketplace AA Premium
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={successData ? handleFinish : onClose}
            className="text-neutral-500 hover:text-white transition-colors font-bold text-xl h-8 w-8 rounded-full border border-white/[0.05] hover:border-white/[0.1] bg-white/[0.02] flex items-center justify-center cursor-pointer"
          >
            &times;
          </button>
        </div>

        {successData ? (
          /* Premium Purchase Receipt Screen */
          <div className="p-6 space-y-6 animate-scale-up text-center">

            {/* Success Checkmark Ring */}
            <div className="flex justify-center">
              <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-white">Terima Kasih Atas Belanja Anda!</h4>
              <p className="text-xs text-neutral-400">Pesanan telah berhasil dicatat dalam database dengan ID #{successData.orderId}</p>
            </div>

            {/* Receipt Summary Grid */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 text-left text-xs space-y-3.5">
              <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-neutral-400">Produk</span>
                <span className="font-semibold text-white max-w-[200px] text-right line-clamp-1">{successData.productName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-neutral-400">Jumlah Pembelian</span>
                <span className="font-bold text-white">{successData.quantity} Pcs</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-neutral-400">Nama Pembeli</span>
                <span className="font-semibold text-white">{successData.buyerName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-neutral-400">Alamat Pengiriman</span>
                <span className="font-medium text-neutral-300 max-w-[200px] text-right line-clamp-2">{successData.address}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-neutral-400 font-bold uppercase tracking-wider">Total Pembayaran</span>
                <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
                  {formatRupiah(successData.totalPrice)}
                </span>
              </div>
            </div>

            {/* Action Done */}
            <button
              onClick={handleFinish}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-violet-600/20 cursor-pointer"
            >
              Selesai & Tutup Katalog
            </button>
          </div>
        ) : (
          /* Input Form Screen */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* Error Message */}
            {error && (
              <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-4 text-xs text-red-400 flex items-start gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Product Overview Card in Form */}
            <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
              <img
                src={product.image_url}
                alt={product.name}
                className="h-16 w-16 object-cover rounded-xl border border-white/10 bg-zinc-900"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600';
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm truncate">{product.name}</h4>
                <p className="text-xs text-violet-400 font-extrabold mt-0.5">{formatRupiah(product.price)}</p>
                <p className="text-[10px] text-neutral-500 mt-1 font-semibold">
                  Sisa Stok: <span className={product.stock <= 5 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>{product.stock} Pcs</span>
                </p>
              </div>
            </div>

            {/* Buyer Name Input */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Nama Lengkap Pembeli
              </label>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl text-xs text-white placeholder-neutral-600 outline-none transition-all"
              />
            </div>

            {/* Address Input */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Alamat Lengkap Pengiriman
              </label>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="Tuliskan nama jalan, nomor rumah, RT/RW, kecamatan, kota, dan kode pos..."
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-2xl text-xs text-white placeholder-neutral-600 outline-none transition-all resize-none"
              />
            </div>

            {/* Counter Section and Real-Time Total Price */}
            <div className="grid grid-cols-2 gap-4 items-center border-t border-white/[0.06] pt-4">

              {/* Order Quantity Counter */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Jumlah Pesanan
                </label>
                <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.08] rounded-2xl p-1 w-fit">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={quantity <= 1 || isLoading}
                    className="h-8 w-8 rounded-xl bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08] flex items-center justify-center font-black transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    disabled={isLoading}
                    className="w-12 text-center bg-transparent border-0 text-white font-bold text-xs outline-none [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:margin-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:margin-0 [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={quantity >= product.stock || isLoading}
                    className="h-8 w-8 rounded-xl bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08] flex items-center justify-center font-black transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Real-time Total Price Display */}
              <div className="text-right flex flex-col justify-end h-full">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  Total Pembayaran
                </span>
                <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 tracking-tight mt-1">
                  {formatRupiah(totalCalculatedPrice)}
                </span>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-5 py-3 text-xs font-bold text-neutral-400 hover:text-white hover:bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] rounded-2xl transition-all cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-2xl shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Konfirmasi Beli</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
