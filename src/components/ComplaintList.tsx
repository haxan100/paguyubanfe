import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { MessageCircle, Plus, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import ComplaintForm from './ComplaintForm';

export default function ComplaintList() {
  const { user } = useAuth();
  const { complaints, updateComplaintStatus } = useData();
  const [showForm, setShowForm] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);

  const getUserComplaints = () => {
    if (user?.role === 'warga') {
      return complaints.filter(c => c.userId === user.id);
    }
    return complaints; // Admin can see all complaints
  };

  const userComplaints = getUserComplaints();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'in-progress':
        return <Clock size={16} className="text-blue-600" />;
      default:
        return <AlertCircle size={16} className="text-orange-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'Selesai';
      case 'in-progress':
        return 'Sedang Diproses';
      default:
        return 'Menunggu';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'maintenance':
        return 'Pemeliharaan';
      case 'security':
        return 'Keamanan';
      case 'noise':
        return 'Kebisingan';
      default:
        return 'Lainnya';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'warga' ? 'Aduan Saya' : 'Kelola Aduan'}
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'warga' 
              ? 'Lihat dan kelola aduan yang Anda kirimkan'
              : 'Kelola semua aduan dari warga'
            }
          </p>
        </div>
        {user?.role === 'warga' && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Buat Aduan</span>
          </button>
        )}
      </div>

      {userComplaints.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <MessageCircle size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Aduan</h3>
          <p className="text-gray-600 mb-6">
            {user?.role === 'warga' 
              ? 'Anda belum memiliki aduan. Klik tombol "Buat Aduan" untuk memulai.'
              : 'Belum ada aduan yang masuk dari warga.'
            }
          </p>
          {user?.role === 'warga' && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>Buat Aduan Pertama</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {userComplaints.map((complaint) => (
            <div key={complaint.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{complaint.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                      {getStatusText(complaint.status)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span>Kategori: {getCategoryText(complaint.category)}</span>
                    <span>•</span>
                    <span>Tanggal: {complaint.createdAt.toLocaleDateString('id-ID')}</span>
                    {user?.role === 'admin' && (
                      <>
                        <span>•</span>
                        <span>Oleh: {complaint.userName} (Blok {complaint.userBlok})</span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4">{complaint.description}</p>
                  
                  {complaint.photos && complaint.photos.length > 0 && (
                    <div className="flex space-x-2 mb-4">
                      {complaint.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Foto ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => window.open(photo, '_blank')}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  {getStatusIcon(complaint.status)}
                  <span>Status: {getStatusText(complaint.status)}</span>
                </div>
                
                {user?.role === 'admin' && (
                  <div className="flex space-x-2">
                    {complaint.status === 'pending' && (
                      <button
                        onClick={() => updateComplaintStatus(complaint.id, 'in-progress')}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Proses
                      </button>
                    )}
                    {complaint.status === 'in-progress' && (
                      <button
                        onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Selesaikan
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedComplaint(complaint.id)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1"
                    >
                      <Eye size={14} />
                      <span>Detail</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <ComplaintForm onClose={() => setShowForm(false)} />}
    </div>
  );
}