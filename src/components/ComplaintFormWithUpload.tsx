import React, { useState } from 'react';
import { Upload, Send } from 'lucide-react';
import Swal from 'sweetalert2';

interface ComplaintFormProps {
  userId: number;
  onSuccess: () => void;
}

const ComplaintFormWithUpload: React.FC<ComplaintFormProps> = ({ userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    kategori: 'infrastruktur'
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('user_id', userId.toString());
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
        onSuccess();
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
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Judul Aduan
        </label>
        <input
          type="text"
          value={formData.judul}
          onChange={(e) => setFormData({...formData, judul: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kategori
        </label>
        <select
          value={formData.kategori}
          onChange={(e) => setFormData({...formData, kategori: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="infrastruktur">Infrastruktur</option>
          <option value="kebersihan">Kebersihan</option>
          <option value="keamanan">Keamanan</option>
          <option value="lainnya">Lainnya</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi
        </label>
        <textarea
          value={formData.deskripsi}
          onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Foto (Opsional)
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFoto(e.target.files?.[0] || null)}
            className="hidden"
            id="foto-upload"
          />
          <label
            htmlFor="foto-upload"
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200"
          >
            <Upload className="w-4 h-4 mr-2" />
            Pilih Foto
          </label>
          {foto && <span className="text-sm text-gray-600">{foto.name}</span>}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        <Send className="w-4 h-4 mr-2" />
        {loading ? 'Mengirim...' : 'Kirim Aduan'}
      </button>
    </form>
  );
};

export default ComplaintFormWithUpload;