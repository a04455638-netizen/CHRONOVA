import React from 'react';
import HeroBanner from '@/components/store/HeroBanner';
import HomeSectionsClient from '@/components/store/HomeSectionsClient';
import { DataStore } from '@/lib/data/store';

export default async function HomePage() {
  const featuredProducts = await DataStore.getFeaturedProducts();
  const brands = await DataStore.getBrands();
  const categories = await DataStore.getCategories();

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Dynamic Multilingual Sections */}
      <HomeSectionsClient
        featuredProducts={featuredProducts}
        brands={brands}
        categories={categories}
      />
    </div>
  );
}
