"use client";

import React, { useState } from "react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void; // Menyesuaikan dengan parameter di AdminDashboard
}

export default function AddProductModal({ isOpen, onClose, onProductAdded }: AddProductModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Tempat menyimpan string hasil konversi gambar
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Fungsi sakti untuk merubah file gambar menjadi teks Base64 yang ringkas
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          // Kompresi ukuran ke 300x300 piksel agar strings teks base64 tidak terlalu panjang di database
          canvas.width = 300;
          canvas.height = 300;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, 300, 300);

          // Ubah ke format JPEG dengan kualitas 60%
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
          setImageUrl(compressedBase64);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: parseInt(price),
          description,
          // Mengirimkan strings gambar base64 atau gambar default jika kosong
          image_url: imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
          stock: parseInt(stock),
        }),
      });

      if (res.ok) {
        setName("");
        setPrice("");
        setDescription("");
        setImageUrl("");
        setStock("");
        onProductAdded(); // Memanggil fungsi refresh otomatis di halaman admin
        onClose();
        alert("Produk baru berhasil ditambahkan!");
      } else {
        alert("Gagal menyimpan produk. Coba periksa koneksi backend.");
      }
    } catch (error) {
      console.error("Gagal menambah produk:", error);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">Tambah Produk Baru</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Nama Produk</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white" placeholder="Contoh: Sepatu Sneakers Aesthetic" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Harga (Rp)</label>
              <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white" placeholder="Rupiah" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Stok</label>
              <input type="number" required value={stock} onChange={(e) => setStock(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white" placeholder="Jumlah" />
            </div>
          </div>

          {/* INPUT GAMBAR PILIH FILE DARI LAPTOP */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Pilih Gambar Produk</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {imageUrl && (
              <div className="mt-2 flex gap-2 items-center">
                <img src={imageUrl} alt="Preview" className="h-12 w-12 object-cover rounded-md border border-slate-200" />
                <p className="text-[10px] text-slate-400">Gambar berhasil diproses & siap disimpan</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Deskripsi</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white resize-none" placeholder="Detail spesifikasi produk..."></textarea>
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg">Batal</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm">
              {loading ? "Menyimpan..." : "Simpan Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}