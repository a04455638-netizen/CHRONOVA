import React from 'react';
import { DataStore } from '@/lib/data/store';
import CategoriesClient from './CategoriesClient';

export const metadata = {
  title: 'Kategoriyalar — CHRONOVA Admin',
};

export default async function AdminCategoriesPage() {
  const categories = await DataStore.getAllCategoriesAdmin();
  const products = await DataStore.getAllProductsAdmin();

  return (
    <CategoriesClient
      initialCategories={categories}
      products={products}
    />
  );
}
