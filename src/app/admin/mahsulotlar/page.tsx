import React from 'react';
import { DataStore } from '@/lib/data/store';
import AdminProductsClient from './AdminProductsClient';

export const metadata = {
  title: 'Mahsulotlar Boshqaruvi — CHRONOVA Admin',
};

export default async function AdminProductsPage() {
  const products = await DataStore.getAllProductsAdmin();
  const brands = await DataStore.getAllBrandsAdmin();
  const categories = await DataStore.getAllCategoriesAdmin();

  return (
    <AdminProductsClient
      initialProducts={products}
      brands={brands}
      categories={categories}
    />
  );
}
