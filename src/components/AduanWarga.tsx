import React, { useState, useEffect } from 'react';
import { Trash2, MessageCircle, Send, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { apiRequest } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface Aduan {
  id: number;
  user_id: number;
  judul: string;
  kategori: string;
  deskripsi: string;
  foto: string | null;
  status: string;
  nama_user: string;
  blok: string;
  tanggal_aduan: string;
}

interface Comment {
  id: number;
  komentar: string;
  nama: string;
  jenis: string;
  blok: string;
  tanggal_komentar: string;
}

export default function AduanWarga() {
  const { user } = useAuth();
  const [aduan, setAduan] = useState<Aduan[]>([]);
  const [showComments, setShowComments] = useState<{[key: number]: boolean}>({});
  const [comments, setComments] = useState<{[key: number]: Comment[]}>({});
  const [newComment, setNewComment] = useState<{[key: number]: string}>({});

  useEffect(() => {
    fetchAduan();
  }, []);

  const fetchAduan = async () => {
    try {
      const response = await apiRequest('/api/aduan');
      const result = await response.json();
      if (result.status === 'success') {
        // Filter berdasarkan blok untuk koordinator
        let filteredAduan = result.data;
        if (user?.jenis === 'koordinator_perblok') {
          const userBlok = user.blok?.charAt(0); // Ambil huruf pertama blok (A, B, C, dst)
          filteredAduan = result.data.filter((item: Aduan) => 
            item.blok?.charAt(0) === userBlok
          );
        }
        setAduan(filteredAduan);
      }
    } catch (error) {
      console.error('Error fetching aduan:', error);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Hapus Aduan?',
      text: 'Aduan akan dihapus permanen',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const response = await apiRequest(`/api/aduan/${id}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.status === 'success') {
          fetchAduan();
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Aduan berhasil dihapus',
            timer: 2000,
            showConfirmButton: false
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Gagal menghapus aduan'
        });
      }
    }
  };

  const toggleComments = async (aduanId: number) => {
    if (!showComments[aduanId]) {
      try {
        const response = await apiRequest(`/api/aduan/${aduanId}/comments`);
        const result = await response.json();
        if (result.status === 'success') {
          setComments(prev => ({ ...prev, [aduanId]: result.data }));
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
    
    setShowComments(prev => ({ ...prev, [aduanId]: !prev[aduanId] }));
  };

  const handleAddComment = async (aduanId: number) => {
    const comment = newComment[aduanId]?.trim();
    if (!comment) return;

    try {
      const response = await apiRequest(`/api/aduan/${aduanId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ komentar: comment })
      });

      if (response.ok) {
        setNewComment(prev => ({ ...prev, [aduanId]: '' }));
        toggleComments(aduanId); // Refresh comments
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const canDelete = (item: Aduan) => {
    if (user?.jenis === 'ketua') return true;
    if (user?.jenis === 'koordinator_perblok') {
      const userBlok = user.blok?.charAt(0);
      const itemBlok = item.blok?.charAt(0);
      return userBlok === itemBlok;
    }
    return false;
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>
        {user?.jenis === 'koordinator_perblok' ? `Aduan Blok ${user.blok?.charAt(0)}` : 'Kelola Aduan Warga'}
      </h1>
      
      <div className="space-y-4">
        {aduan.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-4 shadow border">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-lg'}`}>{item.judul}</h3>
                <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {item.nama_user} - Blok {item.blok} • {new Date(item.tanggal_aduan).toLocaleDateString('id-ID')}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  item.status === 'proses' ? 'bg-blue-100 text-blue-800' :
                  item.status === 'selesai' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
                {canDelete(item) && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                    title="Hapus aduan"
                  >
                    <Trash2 size={isMobile ? 14 : 16} />
                  </button>
                )}
              </div>
            </div>
            
            <p className={`text-gray-600 mb-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Kategori: <span className="font-medium">{item.kategori}</span>
            </p>
            <p className={`text-gray-700 mb-3 ${isMobile ? 'text-sm' : ''}`}>{item.deskripsi}</p>
            
            {item.foto && (
              <img
                src={`/assets/uploads/${item.foto}`}
                alt="Foto aduan"
                className={`object-cover rounded cursor-pointer mb-3 ${isMobile ? 'w-24 h-18' : 'w-32 h-24'}`}
                onClick={() => window.open(`/assets/uploads/${item.foto}`, '_blank')}
              />
            )}

            {/* Comments Section */}
            <div className="border-t pt-3">
              <button
                onClick={() => toggleComments(item.id)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-3"
              >
                <MessageCircle size={16} />
                <span className="text-sm">
                  {showComments[item.id] ? 'Sembunyikan Komentar' : 'Lihat Komentar'}
                </span>
              </button>

              {showComments[item.id] && (
                <div className="space-y-3">
                  {/* Comments List */}
                  {comments[item.id]?.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`font-semibold text-sm ${isMobile ? 'text-xs' : ''}`}>
                          {comment.nama}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          comment.jenis === 'ketua' ? 'bg-purple-100 text-purple-800' :
                          comment.jenis === 'admin' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {comment.jenis === 'ketua' ? 'Ketua' :
                           comment.jenis === 'admin' ? 'Admin' : 'Koordinator'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.tanggal_komentar).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <p className={`text-gray-700 ${isMobile ? 'text-sm' : ''}`}>{comment.komentar}</p>
                    </div>
                  ))}
                  
                  {/* Add Comment */}
                  <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-2'}`}>
                    <input
                      type="text"
                      value={newComment[item.id] || ''}
                      onChange={(e) => setNewComment(prev => ({ ...prev, [item.id]: e.target.value }))}
                      placeholder="Tulis komentar..."
                      className={`px-3 py-2 border border-gray-300 rounded-lg ${isMobile ? 'w-full' : 'flex-1'}`}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(item.id)}
                    />
                    <button
                      onClick={() => handleAddComment(item.id)}
                      className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${isMobile ? 'w-full' : ''}`}
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {aduan.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              {user?.jenis === 'koordinator_perblok' 
                ? `Belum ada aduan di Blok ${user.blok?.charAt(0)}`
                : 'Belum ada aduan'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}