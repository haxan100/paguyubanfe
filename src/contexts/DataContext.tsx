import React, { createContext, useContext, useState } from 'react';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: 'maintenance' | 'security' | 'noise' | 'other';
  status: 'pending' | 'in-progress' | 'resolved';
  userId: string;
  userName: string;
  userBlok: string;
  createdAt: Date;
  photos?: string[];
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  userBlok: string;
  year: number;
  month: number;
  amount: number;
  proofPhoto?: string;
  status: 'unpaid' | 'pending' | 'verified';
  uploadedAt?: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
}

export interface Document {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: Date;
  description?: string;
  category: 'announcement' | 'regulation' | 'financial' | 'meeting' | 'other';
}

export interface Settings {
  complaintMenuEnabled: boolean;
}

interface DataContextType {
  complaints: Complaint[];
  payments: Payment[];
  documents: Document[];
  settings: Settings;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt'>) => void;
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
  uploadPaymentProof: (userId: string, year: number, month: number, proofPhoto: string) => void;
  verifyPayment: (paymentId: string, verifiedBy: string) => void;
  getPaymentsByUser: (userId: string) => Payment[];
  getPaymentsByBlok: (blok: string) => Payment[];
  addDocument: (document: Omit<Document, 'id' | 'uploadedAt'>) => void;
  deleteDocument: (id: string) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: '1',
      title: 'Lampu koridor rusak',
      description: 'Lampu di koridor lantai 3 blok A sudah mati sejak kemarin',
      category: 'maintenance',
      status: 'pending',
      userId: '4',
      userName: 'Warga 1',
      userBlok: 'A',
      createdAt: new Date('2024-01-15'),
    },
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      userId: '4',
      userName: 'Warga 1',
      userBlok: 'A',
      year: 2024,
      month: 1,
      amount: 100000,
      status: 'unpaid',
    },
    {
      id: '2',
      userId: '4',
      userName: 'Warga 1',
      userBlok: 'A',
      year: 2024,
      month: 2,
      amount: 100000,
      status: 'verified',
      proofPhoto: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
      uploadedAt: new Date('2024-02-01'),
      verifiedAt: new Date('2024-02-02'),
      verifiedBy: 'Andi Koordinator',
    },
    {
      id: '3',
      userId: '5',
      userName: 'Warga 2',
      userBlok: 'B',
      year: 2024,
      month: 1,
      amount: 100000,
      status: 'pending',
      proofPhoto: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
      uploadedAt: new Date('2024-01-30'),
    },
  ]);

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      title: 'Peraturan Tata Tertib Kompleks',
      fileName: 'tata-tertib-kompleks.pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploadedBy: 'Budi Santoso',
      uploadedAt: new Date('2024-01-10'),
      description: 'Peraturan tata tertib yang harus dipatuhi oleh seluruh warga kompleks',
      category: 'regulation',
    },
    {
      id: '2',
      title: 'Laporan Keuangan Januari 2024',
      fileName: 'laporan-keuangan-jan-2024.pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploadedBy: 'Siti Admin',
      uploadedAt: new Date('2024-02-01'),
      description: 'Laporan keuangan kompleks untuk bulan Januari 2024',
      category: 'financial',
    },
    {
      id: '3',
      title: 'Pengumuman Rapat Bulanan',
      fileName: 'pengumuman-rapat-feb-2024.pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploadedBy: 'Budi Santoso',
      uploadedAt: new Date('2024-02-05'),
      description: 'Pengumuman rapat bulanan yang akan dilaksanakan pada tanggal 15 Februari 2024',
      category: 'announcement',
    },
  ]);

  const [settings, setSettings] = useState<Settings>({
    complaintMenuEnabled: true,
  });

  const addComplaint = (complaint: Omit<Complaint, 'id' | 'createdAt'>) => {
    const newComplaint: Complaint = {
      ...complaint,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setComplaints(prev => [newComplaint, ...prev]);
  };

  const updateComplaintStatus = (id: string, status: Complaint['status']) => {
    setComplaints(prev =>
      prev.map(complaint =>
        complaint.id === id ? { ...complaint, status } : complaint
      )
    );
  };

  const uploadPaymentProof = (userId: string, year: number, month: number, proofPhoto: string) => {
    setPayments(prev =>
      prev.map(payment =>
        payment.userId === userId && payment.year === year && payment.month === month
          ? {
              ...payment,
              proofPhoto,
              status: 'pending',
              uploadedAt: new Date(),
            }
          : payment
      )
    );
  };

  const verifyPayment = (paymentId: string, verifiedBy: string) => {
    setPayments(prev =>
      prev.map(payment =>
        payment.id === paymentId
          ? {
              ...payment,
              status: 'verified',
              verifiedAt: new Date(),
              verifiedBy,
            }
          : payment
      )
    );
  };

  const getPaymentsByUser = (userId: string) => {
    return payments.filter(payment => payment.userId === userId);
  };

  const getPaymentsByBlok = (blok: string) => {
    return payments.filter(payment => payment.userBlok === blok);
  };

  const addDocument = (document: Omit<Document, 'id' | 'uploadedAt'>) => {
    const newDocument: Document = {
      ...document,
      id: Date.now().toString(),
      uploadedAt: new Date(),
    };
    setDocuments(prev => [newDocument, ...prev]);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <DataContext.Provider
      value={{
        complaints,
        payments,
        documents,
        settings,
        addComplaint,
        updateComplaintStatus,
        uploadPaymentProof,
        verifyPayment,
        getPaymentsByUser,
        getPaymentsByBlok,
        addDocument,
        deleteDocument,
        updateSettings,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}