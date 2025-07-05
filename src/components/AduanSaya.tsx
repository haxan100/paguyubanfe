import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit, Trash2, Send, Camera, X } from 'lucide-react';

interface Aduan {
  id: number;
  judul: string;
  kategori: string;
  deskripsi: string;
  foto: string | null;
  status: string;
  jawaban: string | null;
  tanggal_aduan: string;
}

export default function AduanSaya() {
  const { user } = useAuth();
  const [aduan, setAduan] = useState<Aduan[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAduan, setEditingAduan] = useState<Aduan | null>(null);
  const [formData, setFormData] = useState({
    judul: '',
    kategori: '',
    deskripsi: ''
  });
  const [foto, setFoto] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      fetchAduan();
    }
  }, [user]);

  const fetchAduan = async () => {
    try {
      const response = await fetch(`/api/aduan/user/${user?.id}`);
      const data = await response.json();
      if (data.status === 'success') {
        setAduan(data.data);
      }
    } catch (error) {
      console.error('Error fetching aduan:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      if (editingAduan) {
        // Update existing aduan
        formDataToSend.append('judul', formData.judul);
        formDataToSend.append('deskripsi', formData.deskripsi);
        formDataToSend.append('kategori', formData.kategori);
        
        if (foto) {
          formDataToSend.append('foto', foto);
        }

        const response = await fetch(`/api/aduan/${editingAduan.id}`, {
          method: 'PUT',
          body: formDataToSend
        });
        
        const data = await response.json();
        if (data.status === 'success') {
          setShowModal(false);
          setEditingAduan(null);
          setFormData({ judul: '', kategori: '', deskripsi: '' });
          setFoto(null);
          fetchAduan();
        }
      } else {
        // Create new aduan
        formDataToSend.append('user_id', user?.id.toString() || '');
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
        
        const data = await response.json();
        if (data.status === 'success') {
          setShowModal(false);
          setFormData({ judul: '', kategori: '', deskripsi: '' });
          setFoto(null);
          fetchAduan();
        }
      }
    } catch (error) {
      console.error('Error submitting aduan:', error);
    }
  };

  const handleEdit = (item: Aduan) => {
    setEditingAduan(item);
    setFormData({
      judul: item.judul,
      kategori: item.kategori,
      deskripsi: item.deskripsi
    });
    setFoto(null);
    setShowModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
    }
  };

  const removeFoto = () => {
    setFoto(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus aduan ini?')) {
      try {
        const response = await fetch(`/api/aduan/${id}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.status === 'success') {
          fetchAduan();
        }
      } catch (error) {
        console.error('Error deleting aduan:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Aduan Saya</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Tambah Aduan</span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {editingAduan ? 'Edit Aduan' : 'Tambah Aduan'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Judul"
                value={formData.judul}
                onChange={(e) => setFormData({...formData, judul: e.target.value})}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Pilih Kategori</option>
                <option value="infrastruktur">Infrastruktur</option>
                <option value="keamanan">Keamanan</option>
                <option value="kebersihan">Kebersihan</option>
                <option value="lainnya">Lainnya</option>
              </select>
              <textarea
                placeholder="Deskripsi"
                value={formData.deskripsi}
                onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                className="w-full p-3 border rounded-lg h-24 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
              
              {/* Upload Foto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Foto (Opsional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                
                {/* Preview Foto */}
                {(foto || (editingAduan && editingAduan.foto)) && (
                  <div className="mt-2">
                    <div className="relative inline-block">
                      <img
                        src={foto ? URL.createObjectURL(foto) : `/assets/uploads/${editingAduan?.foto}`}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={removeFoto}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    {editingAduan && editingAduan.foto && !foto && (
                      <p className="text-xs text-gray-500 mt-1">Foto saat ini (pilih file baru untuk mengganti)</p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingAduan ? 'Update' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAduan(null);
                    setFormData({ judul: '', kategori: '', deskripsi: '' });
                    setFoto(null);
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List Aduan */}
      <div className="space-y-4">
        {aduan.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">{item.judul}</h3>
              <span className={`px-2 py-1 rounded text-xs ${
                item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                item.status === 'proses' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {item.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.kategori}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-3">{item.deskripsi}</p>
            
            {/* Display Foto */}
            {item.foto && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Foto:</p>
                <img
                  src={`/assets/uploads/${item.foto}`}
                  alt="Foto aduan"
                  className="w-32 h-24 object-cover rounded border cursor-pointer"
                  onClick={() => window.open(`/assets/uploads/${item.foto}`, '_blank')}
                />
              </div>
            )}
            
            {item.jawaban && (
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded mb-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Jawaban:</p>
                <p className="text-gray-700 dark:text-gray-300">{item.jawaban}</p>
              </div>
            )}
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(item)}
                className="flex items-center space-x-1 bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
              >
                <Edit size={14} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                <Trash2 size={14} />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}