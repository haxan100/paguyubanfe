import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { MessageCircle, Camera, Send, X } from 'lucide-react';
import Swal from 'sweetalert2';

interface ComplaintFormProps {
  onClose: () => void;
}

export default function ComplaintForm({ onClose }: ComplaintFormProps) {
  const { user } = useAuth();
  const { addComplaint } = useData();
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    kategori: 'infrastruktur' as const,
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('user_id', user.id.toString());
      formDataToSend.append('judul', formData.judul);
      formDataToSend.append('deskripsi', formData.deskripsi);
      formDataToSend.append('kategori', formData.kategori);
      
      if (foto) {
        formDataToSend.append('foto', foto);
      }

      const response = await fetch('/api/aduan', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (result.status === 'success') {
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Aduan berhasil dibuat',
          timer: 2000,
          showConfirmButton: false
        });
        
        setFormData({ judul: '', deskripsi: '', kategori: 'infrastruktur' });
        setFoto(null);
        onClose();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal membuat aduan'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
    }
  };

  const removePhoto = () => {
    setFoto(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle size={20} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Buat Aduan Baru</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-2">
              Judul Aduan
            </label>
            <input
              id="judul"
              type="text"
              value={formData.judul}
              onChange={(e) => setFormData(prev => ({ ...prev, judul: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Masukkan judul aduan"
              required
            />
          </div>

          <div>
            <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              id="kategori"
              value={formData.kategori}
              onChange={(e) => setFormData(prev => ({ ...prev, kategori: e.target.value as any }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="infrastruktur">Infrastruktur</option>
              <option value="kebersihan">Kebersihan</option>
              <option value="keamanan">Keamanan</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              id="deskripsi"
              value={formData.deskripsi}
              onChange={(e) => setFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              placeholder="Jelaskan detail aduan Anda"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Pendukung (Opsional)
            </label>
            <div className="space-y-4">
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                <div className="text-center">
                  <Camera size={24} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Klik untuk upload foto</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              {foto && (
                <div className="relative inline-block">
                  <img
                    src={URL.createObjectURL(foto)}
                    alt="Preview"
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={16} />
                  <span>Kirim Aduan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}