import React from 'react';
import { DataStore } from '@/lib/data/store';
import AdminOrdersClient from './AdminOrdersClient';

export const metadata = {
  title: 'Buyurtmalar Ro‘yxati — CHRONOVA Admin',
};

export default async function AdminOrdersPage() {
  const orders = await DataStore.getOrders();

  return <AdminOrdersClient initialOrders={orders} />;
}
