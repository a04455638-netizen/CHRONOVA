'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Brand, Category, Product } from '@/types';
import WatchFilters from '@/components/store/WatchFilters';
import ProductCard from '@/components/store/ProductCard';
import { Filter, SlidersHorizontal, PackageSearch } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

interface CatalogClientProps {
  initialProducts: Product[];
  brands: Brand[];
  categories: Category[];
}

export default function CatalogClient({
  initialProducts,
  brands,
  categories,
}: CatalogClientProps) {
  const searchParams = useSearchParams();
  const { t } = useI18n();

  const initialCat = searchParams.get('cat') || 'all';
  const initialBrand = searchParams.get('brand') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedMovement, setSelectedMovement] = useState('all');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'name_asc' | 'newest'>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Client-side instant filtering for incredible UX speed
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.model_number.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand?.name.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }

    if (selectedBrand !== 'all') {
      list = list.filter((p) => p.brand?.slug === selectedBrand || p.brand_id === selectedBrand);
    }

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category?.slug === selectedCategory || p.category_id === selectedCategory);
    }

    if (selectedMovement !== 'all') {
      list = list.filter((p) => p.movement_type === selectedMovement);
    }

    if (inStockOnly) {
      list = list.filter((p) => p.stock_quantity > 0);
    }

    if (sortBy === 'price_asc') {
      list.sort((a, b) => (a.sale_price_uzs || a.base_price_uzs) - (b.sale_price_uzs || b.base_price_uzs));
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => (b.sale_price_uzs || b.base_price_uzs) - (a.sale_price_uzs || a.base_price_uzs));
    } else if (sortBy === 'name_asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return list;
  }, [initialProducts, searchQuery, selectedBrand, selectedCategory, selectedMovement, inStockOnly, sortBy]);

  const handleReset = () => {
    setSelectedBrand('all');
    setSelectedCategory('all');
    setSelectedMovement('all');
    setSearchQuery('');
    setInStockOnly(false);
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header section */}
      <div className="mb-8">
        <span className="text-xs uppercase tracking-widest text-gold-600 dark:text-gold-400 font-semibold block mb-1">
          CHRONOVA Kolleksiyasi
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-graphite-900 dark:text-ivory-100">
          Shveytsariya Soatlari Katalogi
        </h1>
        <p className="text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 mt-2 max-w-2xl">
          Dunyoning eng mashhur manufakturalarining original modellari. Har bir soat rasmiy sertifikat va qutisi bilan yetkaziladi.
        </p>
      </div>

      {/* Bar: Result count + Sort dropdown + Mobile filter button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-graphite-200 dark:border-graphite-800 gap-4">
        <div className="text-xs text-graphite-600 dark:text-ivory-400">
          Topildi: <span className="font-bold text-gold-600 dark:text-gold-400">{filteredProducts.length}</span> ta model
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-4 py-2 rounded-xl bg-ivory-200 dark:bg-graphite-800 text-graphite-800 dark:text-ivory-200 text-xs font-semibold flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-gold-500" />
            <span>Filtrlar</span>
          </button>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-graphite-500 hidden sm:inline">Saralash:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-surface-darkCard border border-graphite-300 dark:border-graphite-700 rounded-xl px-3 py-2 text-xs text-graphite-800 dark:text-ivory-200 focus:outline-none focus:border-gold-500"
            >
              <option value="newest">{t('sort_newest')}</option>
              <option value="price_asc">{t('sort_price_asc')}</option>
              <option value="price_desc">{t('sort_price_desc')}</option>
              <option value="name_asc">{t('sort_name')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <WatchFilters
            brands={brands}
            categories={categories}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedMovement={selectedMovement}
            setSelectedMovement={setSelectedMovement}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onReset={handleReset}
          />
        </div>

        {/* Mobile Filter Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
            <div className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white dark:bg-surface-darkCard p-6 overflow-y-auto">
              <WatchFilters
                brands={brands}
                categories={categories}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedMovement={selectedMovement}
                setSelectedMovement={setSelectedMovement}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onReset={handleReset}
              />
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full mt-6 py-3 rounded-xl bg-gold-500 text-white font-semibold text-xs uppercase"
              >
                Natijalarni ko‘rish ({filteredProducts.length})
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-ivory-100 dark:bg-surface-darkCard rounded-3xl p-8 border border-graphite-200 dark:border-graphite-800">
              <div className="w-16 h-16 rounded-full bg-gold-500/10 text-gold-500 flex items-center justify-center mx-auto mb-4">
                <PackageSearch className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-graphite-900 dark:text-ivory-100 mb-2">
                Mos soatlar topilmadi
              </h3>
              <p className="text-xs text-graphite-500 dark:text-ivory-400 max-w-md mx-auto mb-6">
                Qidiruv so‘rovingiz yoki tanlangan filtrlar bo‘yicha hech narsa chiqmadi. Filtr parametrlarini o‘zgartirib ko‘ring.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Filtrlarni tozalash
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
