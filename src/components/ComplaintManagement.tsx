import React, { useState, useEffect } from 'react';
import { Eye, MessageSquare, Upload, Check, X } from 'lucide-react';
import Swal from 'sweetalert2';

interface Aduan {
  id: number;
  judul: string;
  deskripsi: string;
  kategori: string;
  status: string;
  foto: string | null;
  nama_user: string;
  blok: string;
  tanggal_aduan: string;
  jawaban: string | null;
  foto_jawaban: string | null;
  nama_admin: string | null;
}

interface ComplaintManagementProps {
  adminId: number;
}

const ComplaintManagement: React.FC<ComplaintManagementProps> = ({ adminId }) => {
  const [aduan, setAduan] = useState<Aduan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAduan = async () => {
    try {
      const response = await fetch('/api/aduan');
      const result = await response.json();
      if (result.status === 'success') {
        setAduan(result.data);
      }
    } catch (error) {
      console.error('Error fetching aduan:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAduan();
  }, []);

  const handleRespond = async (aduanId: number) => {
    const { value: formValues } = await Swal.fire({
      title: 'Tanggapi Aduan',
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select id="status" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="proses">Sedang Diproses</option>
              <option value="selesai">Selesai</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jawaban</label>
            <textarea id="jawaban" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Masukkan tanggapan..."></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Foto Jawaban (Opsional)</label>
            <input type="file" id="foto_jawaban" accept="image/*" class="w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Kirim',
      cancelButtonText: 'Batal',
      preConfirm: () => {
        const status = (document.getElementById('status') as HTMLSelectElement).value;
        const jawaban = (document.getElementById('jawaban') as HTMLTextAreaElement).value;
        const fotoInput = document.getElementById('foto_jawaban') as HTMLInputElement;
        const foto_jawaban = fotoInput.files?.[0];

        if (!jawaban.trim()) {
          Swal.showValidationMessage('Jawaban harus diisi');
          return false;
        }

        return { status, jawaban, foto_jawaban };
      }
    });

    if (formValues) {
      try {
        const formData = new FormData();
        formData.append('status', formValues.status);
        formData.append('jawaban', formValues.jawaban);
        formData.append('admin_id', adminId.toString());
        
        if (formValues.foto_jawaban) {
          formData.append('foto_jawaban', formValues.foto_jawaban);
        }

        const response = await fetch(`/api/aduan/${aduanId}/status`, {
          method: 'PUT',
          body: formData
        });

        const result = await response.json();

        if (result.status === 'success') {
          await Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Tanggapan berhasil dikirim',
            timer: 2000,
            showConfirmButton: false
          });
          fetchAduan();
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Gagal mengirim tanggapan'
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      proses: 'bg-blue-100 text-blue-800',
      selesai: 'bg-green-100 text-green-800',
      ditolak: 'bg-red-100 text-red-800'
    };
    
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`;
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Manajemen Aduan</h2>
      
      {aduan.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-lg shadow border">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-gray-800">{item.judul}</h3>
              <p className="text-sm text-gray-600">
                {item.nama_user} - Blok {item.blok} • {new Date(item.tanggal_aduan).toLocaleDateString('id-ID')}
              </p>
            </div>
            <span className={getStatusBadge(item.status)}>{item.status}</span>
          </div>
          
          <p className="text-gray-700 mb-3">{item.deskripsi}</p>
          
          {item.foto && (
            <div className="mb-3">
              <img 
                src={`/assets/uploads/${item.foto}`} 
                alt="Foto aduan" 
                className="max-w-xs rounded-lg cursor-pointer"
                onClick={() => window.open(`/assets/uploads/${item.foto}`, '_blank')}
              />
            </div>
          )}
          
          {item.jawaban && (
            <div className="bg-gray-50 p-3 rounded-lg mb-3">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Tanggapan dari {item.nama_admin}:
              </p>
              <p className="text-gray-700">{item.jawaban}</p>
              {item.foto_jawaban && (
                <img 
                  src={`/assets/uploads/${item.foto_jawaban}`} 
                  alt="Foto jawaban" 
                  className="max-w-xs rounded-lg mt-2 cursor-pointer"
                  onClick={() => window.open(`/assets/uploads/${item.foto_jawaban}`, '_blank')}
                />
              )}
            </div>
          )}
          
          {item.status === 'pending' && (
            <button
              onClick={() => handleRespond(item.id)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Tanggapi
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ComplaintManagement;