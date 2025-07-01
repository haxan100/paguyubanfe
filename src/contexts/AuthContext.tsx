import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'ketua' | 'admin' | 'koordinator' | 'warga';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  blok?: string; // For koordinator and warga
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  { id: '1', name: 'Budi Santoso', email: 'ketua@example.com', role: 'ketua' },
  { id: '2', name: 'Siti Admin', email: 'admin@example.com', role: 'admin' },
  { id: '3', name: 'Andi Koordinator', email: 'koordinator@example.com', role: 'koordinator', blok: 'A' },
  { id: '4', name: 'Warga 1', email: 'warga1@example.com', role: 'warga', blok: 'A' },
  { id: '5', name: 'Warga 2', email: 'warga2@example.com', role: 'warga', blok: 'B' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}