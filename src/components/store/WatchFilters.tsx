'use client';

import React from 'react';
import { Brand, Category } from '@/types';
import { Search, RotateCcw, Filter } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

interface WatchFiltersProps {
  brands: Brand[];
  categories: Category[];
  selectedBrand: string;
  setSelectedBrand: (b: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedMovement: string;
  setSelectedMovement: (m: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  inStockOnly: boolean;
  setInStockOnly: (s: boolean) => void;
  sortBy: string;
  setSortBy: (s: any) => void;
  onReset: () => void;
}

export default function WatchFilters({
  brands,
  categories,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  selectedMovement,
  setSelectedMovement,
  searchQuery,
  setSearchQuery,
  inStockOnly,
  setInStockOnly,
  sortBy,
  setSortBy,
  onReset,
}: WatchFiltersProps) {
  const { t } = useI18n();

  const movements = ['Avtomatik', 'Mexanik', 'Kvarts'];

  const getMovementLabel = (m: string) => {
    if (m === 'Avtomatik') return t('movement_automatic');
    if (m === 'Mexanik') return t('movement_mechanical');
    if (m === 'Kvarts') return t('movement_quartz');
    return m;
  };

  return (
    <div className="bg-white dark:bg-surface-darkCard p-6 rounded-2xl border border-graphite-200 dark:border-graphite-800 space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-graphite-200 dark:border-graphite-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gold-500" />
          <h3 className="font-serif text-base font-semibold text-graphite-900 dark:text-ivory-100">
            {t('filter_title')}
          </h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-graphite-500 hover:text-gold-500 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('filter_reset')}</span>
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-graphite-700 dark:text-ivory-300 mb-2">
          {t('filter_search_label')}
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('filter_search_ph')}
            className="w-full bg-ivory-100 dark:bg-surface-dark border border-graphite-300 dark:border-graphite-700 rounded-xl px-3 py-2 pl-9 text-xs focus:outline-none focus:border-gold-500"
          />
          <Search className="w-4 h-4 text-graphite-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-graphite-700 dark:text-ivory-300 mb-2">
          {t('filter_category')}
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-gold-500 text-white'
                : 'bg-ivory-100 dark:bg-graphite-800 text-graphite-700 dark:text-ivory-300 hover:bg-gold-500/20'
            }`}
          >
            {t('filter_all')}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === c.slug
                  ? 'bg-gold-500 text-white'
                  : 'bg-ivory-100 dark:bg-graphite-800 text-graphite-700 dark:text-ivory-300 hover:bg-gold-500/20'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-graphite-700 dark:text-ivory-300 mb-2">
          {t('filter_brand')}
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedBrand('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedBrand === 'all'
                ? 'bg-gold-500 text-white'
                : 'bg-ivory-100 dark:bg-graphite-800 text-graphite-700 dark:text-ivory-300 hover:bg-gold-500/20'
            }`}
          >
            {t('filter_all')}
          </button>
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBrand(b.slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedBrand === b.slug
                  ? 'bg-gold-500 text-white'
                  : 'bg-ivory-100 dark:bg-graphite-800 text-graphite-700 dark:text-ivory-300 hover:bg-gold-500/20'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Movement Types */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-graphite-700 dark:text-ivory-300 mb-2">
          {t('filter_movement')}
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedMovement('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedMovement === 'all'
                ? 'bg-gold-500 text-white'
                : 'bg-ivory-100 dark:bg-graphite-800 text-graphite-700 dark:text-ivory-300 hover:bg-gold-500/20'
            }`}
          >
            {t('filter_all')}
          </button>
          {movements.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMovement(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedMovement === m
                  ? 'bg-gold-500 text-white'
                  : 'bg-ivory-100 dark:bg-graphite-800 text-graphite-700 dark:text-ivory-300 hover:bg-gold-500/20'
              }`}
            >
              {getMovementLabel(m)}
            </button>
          ))}
        </div>
      </div>

      {/* In Stock Only Checkbox */}
      <div className="pt-2">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-graphite-700 dark:text-ivory-300">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="rounded border-graphite-400 text-gold-500 focus:ring-gold-500"
          />
          <span>{t('filter_in_stock')}</span>
        </label>
      </div>
    </div>
  );
}
