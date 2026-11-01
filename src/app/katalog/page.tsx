import React, { Suspense } from 'react';
import { DataStore } from '@/lib/data/store';
import CatalogClient from './CatalogClient';

export const metadata = {
  title: 'Katalog — CHRONOVA Shveytsariya Soatlari',
  description: 'Rolex, Omega, Patek Philippe, Audemars Piguet, Cartier va Tissot soatlarining keng katalogi.',
};

export default async function CatalogPage() {
  const products = await DataStore.getProducts();
  const brands = await DataStore.getBrands();
  const categories = await DataStore.getCategories();

  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-gold-500">Katalog yuklanmoqda...</div>}>
      <CatalogClient
        initialProducts={products}
        brands={brands}
        categories={categories}
      />
    </Suspense>
  );
}
