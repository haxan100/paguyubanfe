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

interface DataContextType {
  complaints: Complaint[];
  payments: Payment[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt'>) => void;
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
  uploadPaymentProof: (userId: string, year: number, month: number, proofPhoto: string) => void;
  verifyPayment: (paymentId: string, verifiedBy: string) => void;
  getPaymentsByUser: (userId: string) => Payment[];
  getPaymentsByBlok: (blok: string) => Payment[];
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
      amount: 150000,
      status: 'unpaid',
    },
    {
      id: '2',
      userId: '4',
      userName: 'Warga 1',
      userBlok: 'A',
      year: 2024,
      month: 2,
      amount: 150000,
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
      amount: 150000,
      status: 'pending',
      proofPhoto: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
      uploadedAt: new Date('2024-01-30'),
    },
  ]);

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

  return (
    <DataContext.Provider
      value={{
        complaints,
        payments,
        addComplaint,
        updateComplaintStatus,
        uploadPaymentProof,
        verifyPayment,
        getPaymentsByUser,
        getPaymentsByBlok,
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