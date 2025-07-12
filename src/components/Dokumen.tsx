import React, { useState, useEffect } from 'react';
import { Plus, FileText, Download, Edit, Trash2, Eye, Filter } from 'lucide-react';
import Swal from 'sweetalert2';
import { apiRequest } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface DokumenData {
  id: number;
  judul: string;
  deskripsi: string;
  kategori: string;
  nama_file: string;
  ukuran_file: number;
  tipe_file: string;
  admin_nama: string;
  tanggal_upload: string;
}

export default function Dokumen() {
  const { user } = useAuth();
  const [dokumen, setDokumen] = useState<DokumenData[]>([]);
  const [selectedKategori, setSelectedKategori] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDokumen, setEditingDokumen] = useState<DokumenData | null>(null);
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    kategori: 'Umum'
  });
  const [file, setFile] = useState<File | null>(null);

  const kategoriOptions = ['Umum', 'Surat Keputusan', 'Laporan Keuangan', 'Peraturan', 'Notulen Rapat', 'Surat Edaran'];

  useEffect(() => {
    fetchDokumen();
  }, []);

  useEffect(() => {
    fetchDokumen();
  }, [selectedKategori]);

  const fetchDokumen = async () => {
    try {
      const url = selectedKategori ? `/api/dokumen?kategori=${selectedKategori}` : '/api/dokumen';
      const response = await apiRequest(url);
      const result = await response.json();
      if (result.status === 'success') {
        setDokumen(result.data);
      }
    } catch (error) {
      console.error('Error fetching dokumen:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingDokumen && !file) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'File dokumen wajib diupload'
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('judul', formData.judul);
      formDataToSend.append('deskripsi', formData.deskripsi);
      formDataToSend.append('kategori', formData.kategori);
      
      if (file) {
        formDataToSend.append('file', file);
      }

      const url = editingDokumen ? `/api/dokumen/${editingDokumen.id}` : '/api/dokumen';
      const method = editingDokumen ? 'PUT' : 'POST';
      
      const response = await apiRequest(url, {
        method,
        body: editingDokumen ? JSON.stringify(formData) : formDataToSend,
        headers: editingDokumen ? { 'Content-Type': 'application/json' } : undefined
      });

      const result = await response.json();
      if (result.status === 'success') {
        setShowModal(false);
        setEditingDokumen(null);
        setFormData({ judul: '', deskripsi: '', kategori: 'Umum' });
        setFile(null);
        fetchDokumen();
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: editingDokumen ? 'Dokumen berhasil diupdate' : 'Dokumen berhasil diupload',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: editingDokumen ? 'Gagal mengupdate dokumen' : 'Gagal mengupload dokumen'
      });
    }
  };

  const handleEdit = (dok: DokumenData) => {
    setEditingDokumen(dok);
    setFormData({
      judul: dok.judul,
      deskripsi: dok.deskripsi,
      kategori: dok.kategori
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Hapus Dokumen?',
      text: 'Dokumen akan dihapus permanen',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const response = await apiRequest(`/api/dokumen/${id}`, {
          method: 'DELETE'
        });

        const data = await response.json();
        if (data.status === 'success') {
          fetchDokumen();
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Dokumen berhasil dihapus',
            timer: 2000,
            showConfirmButton: false
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Gagal menghapus dokumen'
        });
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (tipe: string) => {
    if (tipe.includes('pdf')) return '📄';
    if (tipe.includes('word') || tipe.includes('doc')) return '📝';
    return '📄';
  };

  const canManage = user && ['ketua', 'admin'].includes(user.jenis);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dokumen</h2>
        {canManage && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            <span>Upload Dokumen</span>
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-4">
        <Filter size={20} className="text-gray-600" />
        <select
          value={selectedKategori}
          onChange={(e) => setSelectedKategori(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Semua Kategori</option>
          {kategoriOptions.map((kat) => (
            <option key={kat} value={kat}>{kat}</option>
          ))}
        </select>
      </div>

      {/* Dokumen Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dokumen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ukuran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload oleh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dokumen.map((dok) => (
                <tr key={dok.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getFileIcon(dok.tipe_file)}</span>
                      <div>
                        <div className="font-medium">{dok.judul}</div>
                        <div className="text-xs text-gray-500">{dok.nama_file}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {dok.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                    {dok.deskripsi || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatFileSize(dok.ukuran_file)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dok.admin_nama}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(dok.tanggal_upload).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(`/assets/documents/${dok.nama_file}`, '_blank')}
                        className="text-blue-600 hover:text-blue-900"
                        title="Lihat dokumen"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = `/assets/documents/${dok.nama_file}`;
                          link.download = dok.judul;
                          link.click();
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                      {canManage && (
                        <>
                          <button
                            onClick={() => handleEdit(dok)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(dok.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingDokumen ? 'Edit Dokumen' : 'Upload Dokumen'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                <input
                  type="text"
                  value={formData.judul}
                  onChange={(e) => setFormData({...formData, judul: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  {kategoriOptions.map((kat) => (
                    <option key={kat} value={kat}>{kat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
              
              {!editingDokumen && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File Dokumen</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: PDF, DOC, DOCX (Max 10MB)</p>
                </div>
              )}
              
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingDokumen ? 'Update' : 'Upload'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingDokumen(null);
                    setFormData({ judul: '', deskripsi: '', kategori: 'Umum' });
                    setFile(null);
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
    </div>
  );
}