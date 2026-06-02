'use strict';

import React from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  description: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onBuy: (product: Product) => void;
  isAdmin?: boolean;
}

export default function ProductCard({ product, onEdit, onDelete, onBuy, isAdmin = false }: ProductCardProps) {
  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStockBadgeColor = (stock: number) => {
    if (stock === 0) return 'bg-rose-50 text-rose-600 border-rose-100';
    if (stock <= 5) return 'bg-amber-50 text-amber-600 border-amber-100';
    return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  };

  const getStockBadgeText = (stock: number) => {
    if (stock === 0) return 'Habis';
    if (stock <= 5) return `Sisa ${stock} Pcs`;
    return 'Stok Ready';
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:border-slate-200/80 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5">
      
      {/* Product Image Wrapper */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600'}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600';
          }}
        />

        {/* Stock Status Badge */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${getStockBadgeColor(product.stock)}`}>
          {getStockBadgeText(product.stock)}
        </span>
        
        {/* Quick Admin Actions (Edit/Delete floating buttons visible on hover) */}
        {isAdmin && (
          <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            <button
              onClick={() => onEdit(product)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 bg-white/95 text-slate-700 shadow-sm transition-all hover:bg-indigo-600 hover:text-white"
              title="Edit Produk"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 bg-white/95 text-rose-500 shadow-sm transition-all hover:bg-rose-600 hover:text-white"
              title="Hapus Produk"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-base font-bold text-slate-800 transition-colors duration-200 group-hover:text-indigo-600">
          {product.name}
        </h3>
        
        <p className="mt-1.5 line-clamp-2 flex-1 text-xs text-slate-500 leading-relaxed">
          {product.description || 'Tidak ada deskripsi untuk produk ini.'}
        </p>

        {/* Pricing & Add to Cart */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Harga</span>
            <span className="text-lg font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {formatRupiah(product.price)}
            </span>
          </div>

          <button
            onClick={() => onBuy(product)}
            disabled={product.stock === 0}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2.2 text-xs font-bold tracking-wide transition-all duration-300 ${
              product.stock === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/60'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-600 hover:shadow-[0_4px_12px_rgba(79,70,229,0.18)] cursor-pointer'
            }`}
          >
            <span>Beli</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
