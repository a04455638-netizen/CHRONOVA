import React from 'react';
import { DataStore } from '@/lib/data/store';
import CustomersClient from './CustomersClient';

export const metadata = {
  title: 'Mijozlar — CHRONOVA Admin',
};

export default async function AdminCustomersPage() {
  const customers = await DataStore.getCustomers();
  const allOrders = await DataStore.getOrders();

  return (
    <CustomersClient
      initialCustomers={customers}
      allOrders={allOrders}
    />
  );
}
