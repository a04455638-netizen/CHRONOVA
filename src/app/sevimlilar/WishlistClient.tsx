'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/store/ProductCard';
import { Product } from '@/types';

interface WishlistClientProps {
  allProducts: Product[];
}

export default function WishlistClient({ allProducts }: WishlistClientProps) {
  const { wishlistIds } = useWishlist();

  const savedWatches = allProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <span className="text-xs uppercase tracking-[0.3em] font-semibold text-gold-600 dark:text-gold-400 block mb-1">
          Shaxsiy Tanlov
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-graphite-900 dark:text-ivory-100">
          Sevimlilar ({savedWatches.length})
        </h1>
        <p className="text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 mt-1">
          Sizga yoqqan soatlar ro‘yxati.
        </p>
      </div>

      {savedWatches.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface-darkCard rounded-3xl p-8 border border-graphite-200 dark:border-graphite-800">
          <div className="w-16 h-16 rounded-full bg-gold-500/10 text-gold-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-graphite-900 dark:text-ivory-100 mb-2">
            Sevimlilar ro‘yxati bo‘sh
          </h2>
          <p className="text-xs text-graphite-500 dark:text-ivory-400 max-w-md mx-auto mb-6">
            Katalogdagi soatlarni ko‘zdan kechiring va yoqqan modellarni yurakcha belgisi orqali saqlab qo‘ying.
          </p>
          <Link
            href="/katalog"
            className="px-8 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-block"
          >
            Katalogni ko‘rish
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedWatches.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
