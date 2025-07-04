import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit, Trash2, Send, Camera, X } from 'lucide-react';

interface Aduan {
  id: number;
  judul: string;
  jenis_aduan: string;
  deskripsi: string;
  foto: string[];
  status: string;
  jawaban: string;
  created_at: string;
}

export default function AduanSaya() {
  const { user } = useAuth();
  const [aduan, setAduan] = useState<Aduan[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAduan, setEditingAduan] = useState<Aduan | null>(null);
  const [formData, setFormData] = useState({
    judul: '',
    jenis_aduan: '',
    deskripsi: '',
    foto: [] as string[]
  });

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
      const url = editingAduan ? `/api/aduan/${editingAduan.id}` : '/api/aduan';
      const method = editingAduan ? 'PUT' : 'POST';
      
      const payload = editingAduan ? formData : { ...formData, user_id: user?.id };
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setShowModal(false);
        setEditingAduan(null);
        setFormData({ judul: '', jenis_aduan: '', deskripsi: '', foto: [] });
        fetchAduan();
      }
    } catch (error) {
      console.error('Error submitting aduan:', error);
    }
  };

  const handleEdit = (item: Aduan) => {
    setEditingAduan(item);
    setFormData({
      judul: item.judul,
      jenis_aduan: item.jenis_aduan,
      deskripsi: item.deskripsi,
      foto: JSON.parse(item.foto as any) || []
    });
    setShowModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setFormData(prev => ({
            ...prev,
            foto: [...prev.foto, result]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      foto: prev.foto.filter((_, i) => i !== index)
    }));
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
                value={formData.jenis_aduan}
                onChange={(e) => setFormData({...formData, jenis_aduan: e.target.value})}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Pilih Jenis Aduan</option>
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
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                
                {/* Preview Foto */}
                {formData.foto.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {formData.foto.map((foto, index) => (
                      <div key={index} className="relative">
                        <img
                          src={foto}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeFoto(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
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
                    setFormData({ judul: '', jenis_aduan: '', deskripsi: '', foto: [] });
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
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.jenis_aduan}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-3">{item.deskripsi}</p>
            
            {/* Display Foto */}
            {JSON.parse(item.foto as any || '[]').length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Foto:</p>
                <div className="grid grid-cols-3 gap-2">
                  {JSON.parse(item.foto as any).map((foto: string, index: number) => (
                    <img
                      key={index}
                      src={foto}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-20 object-cover rounded border cursor-pointer"
                      onClick={() => window.open(foto, '_blank')}
                    />
                  ))}
                </div>
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