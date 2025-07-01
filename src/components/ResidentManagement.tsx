import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Users, Search, Home, Phone, Mail } from 'lucide-react';

export default function ResidentManagement() {
  const { user } = useAuth();
  const { getPaymentsByBlok } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock resident data - in a real app, this would come from an API
  const blokResidents = [
    { 
      id: '4', 
      name: 'Warga 1', 
      email: 'warga1@example.com', 
      phone: '081234567890',
      unit: 'A-101',
      blok: 'A',
      status: 'active',
      joinDate: new Date('2023-01-15'),
      family: 4
    },
    { 
      id: '6', 
      name: 'Warga 3', 
      email: 'warga3@example.com', 
      phone: '081234567892',
      unit: 'A-103',
      blok: 'A',
      status: 'active',
      joinDate: new Date('2023-03-10'),
      family: 2
    },
    { 
      id: '7', 
      name: 'Warga 4', 
      email: 'warga4@example.com', 
      phone: '081234567893',
      unit: 'A-105',
      blok: 'A',
      status: 'active',
      joinDate: new Date('2023-05-20'),
      family: 3
    },
  ];

  const filteredResidents = blokResidents.filter(resident => 
    resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPaymentStatus = (residentId: string) => {
    const payments = getPaymentsByBlok(user?.blok || '');
    const residentPayments = payments.filter(p => p.userId === residentId);
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const currentPayment = residentPayments.find(p => 
      p.month === currentMonth && p.year === currentYear
    );
    
    return currentPayment?.status || 'unpaid';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Lunas';
      case 'pending':
        return 'Pending';
      default:
        return 'Belum Bayar';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Data Warga Blok {user?.blok}</h1>
        <p className="text-gray-600 mt-2">
          Kelola data warga di blok yang Anda koordinir
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Warga</p>
              <p className="text-2xl font-bold text-gray-900">{filteredResidents.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sudah Bayar</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredResidents.filter(r => getPaymentStatus(r.id) === 'verified').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Home size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600">
                {filteredResidents.filter(r => getPaymentStatus(r.id) === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Home size={24} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Belum Bayar</p>
              <p className="text-2xl font-bold text-red-600">
                {filteredResidents.filter(r => getPaymentStatus(r.id) === 'unpaid').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Home size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, email, atau unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
      </div>

      {/* Residents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResidents.map((resident) => (
          <div key={resident.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Users size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{resident.name}</h3>
                  <p className="text-sm text-gray-500">Unit {resident.unit}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(getPaymentStatus(resident.id))}`}>
                {getStatusText(getPaymentStatus(resident.id))}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Mail size={16} />
                <span>{resident.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Phone size={16} />
                <span>{resident.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Home size={16} />
                <span>{resident.family} anggota keluarga</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Bergabung: {resident.joinDate.toLocaleDateString('id-ID')}</span>
                <span className="font-medium text-gray-700">ID: {resident.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredResidents.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <Users size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Data</h3>
          <p className="text-gray-600">
            Tidak ada warga yang sesuai dengan pencarian.
          </p>
        </div>
      )}
    </div>
  );
}