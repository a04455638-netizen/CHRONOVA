import React from 'react';
import { DataStore } from '@/lib/data/store';
import InventoryClient from './InventoryClient';

export const metadata = {
  title: 'Omborxona — CHRONOVA Admin',
};

export default async function AdminInventoryPage() {
  const products = await DataStore.getAllProductsAdmin();

  return <InventoryClient initialProducts={products} />;
}
