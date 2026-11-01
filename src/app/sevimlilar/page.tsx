import React from 'react';
import { DataStore } from '@/lib/data/store';
import WishlistClient from './WishlistClient';

export const metadata = {
  title: 'Sevimlilar — CHRONOVA',
  description: 'Saqlangan sevimli Shveytsariya soatlari.',
};

export default async function WishlistPage() {
  const allProducts = await DataStore.getProducts();

  return <WishlistClient allProducts={allProducts} />;
}
