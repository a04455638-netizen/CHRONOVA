'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CustomerProfile {
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
}

interface CustomerContextType {
  customer: CustomerProfile | null;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  saveCustomer: (
    dataOrFirstName: { firstName: string; lastName?: string; phone: string } | string,
    lastName?: string,
    phone?: string
  ) => void;
  logoutCustomer: () => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('chronova_customer');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.firstName && parsed.phone) {
          setCustomer(parsed);
        }
      } else {
        // First time visitor - prompt login/registration modal after brief delay
        const dismissed = sessionStorage.getItem('chronova_modal_dismissed');
        if (!dismissed) {
          const timer = setTimeout(() => {
            setIsModalOpen(true);
          }, 800);
          return () => clearTimeout(timer);
        }
      }
    } catch {
      // LocalStorage error ignored
    } finally {
      setHasChecked(true);
    }
  }, []);

  const saveCustomer = (
    dataOrFirstName: { firstName: string; lastName?: string; phone: string } | string,
    lastNameArg?: string,
    phoneArg?: string
  ) => {
    let fName = '';
    let lName = '';
    let ph = '';

    if (typeof dataOrFirstName === 'object') {
      fName = dataOrFirstName.firstName || '';
      lName = dataOrFirstName.lastName || '';
      ph = dataOrFirstName.phone || '';
    } else {
      fName = dataOrFirstName || '';
      lName = lastNameArg || '';
      ph = phoneArg || '';
    }

    const profile: CustomerProfile = {
      firstName: fName.trim(),
      lastName: lName.trim(),
      fullName: `${fName.trim()} ${lName.trim()}`.trim(),
      phone: ph.trim(),
    };

    setCustomer(profile);
    setIsModalOpen(false);

    try {
      localStorage.setItem('chronova_customer', JSON.stringify(profile));
    } catch {}
  };

  const logoutCustomer = () => {
    setCustomer(null);
    try {
      localStorage.removeItem('chronova_customer');
    } catch {}
  };

  return (
    <CustomerContext.Provider
      value={{
        customer,
        isModalOpen,
        setIsModalOpen,
        saveCustomer,
        logoutCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
}
