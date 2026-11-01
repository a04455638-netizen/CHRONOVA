'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/types';
import { formatUzs } from '@/lib/utils/format';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const fallbackImage = '/images/watches/rolex-submariner.jpg';
  const primaryImage = product.images?.[0]?.image_url || fallbackImage;
  const [imgSrc, setImgSrc] = React.useState(primaryImage);

  React.useEffect(() => {
    setImgSrc(product.images?.[0]?.image_url || fallbackImage);
  }, [product.images]);

  const hasSale = product.sale_price_uzs && product.sale_price_uzs < product.base_price_uzs;
  const currentPrice = hasSale ? product.sale_price_uzs! : product.base_price_uzs;

  return (
    <div className="group relative bg-white dark:bg-surface-darkCard rounded-2xl overflow-hidden border border-graphite-200/80 dark:border-graphite-800 hover:border-gold-500/50 transition-all duration-300 hover:shadow-luxury-hover flex flex-col justify-between">
      {/* Top Media Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-ivory-100 dark:bg-graphite-950 flex items-center justify-center">
        <Link href={`/mahsulot/${product.slug}`} className="w-full h-full relative block">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgSrc(fallbackImage)}
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all ${
            inWishlist
              ? 'bg-gold-500 text-white'
              : 'bg-white/80 dark:bg-black/60 text-graphite-700 dark:text-ivory-200 hover:text-gold-500 hover:scale-110'
          }`}
          aria-label="Sevimlilar saqlash"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {hasSale && (
            <span className="px-2.5 py-1 rounded-md bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
              Aksiya
            </span>
          )}
          {product.is_featured && !hasSale && (
            <span className="px-2.5 py-1 rounded-md bg-gold-500 text-white text-[10px] font-bold uppercase tracking-wider shadow">
              Tanlangan
            </span>
          )}
          {product.stock_quantity <= 3 && product.stock_quantity > 0 && (
            <span className="px-2 py-0.5 rounded bg-amber-500/90 text-white text-[9px] font-semibold">
              Qoldiq: {product.stock_quantity} dona
            </span>
          )}
        </div>

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex gap-2">
          <button
            onClick={() => addItem(product)}
            disabled={product.stock_quantity <= 0}
            className="flex-1 py-2.5 bg-graphite-900/95 dark:bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold uppercase tracking-wider rounded-xl backdrop-blur-sm shadow-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.stock_quantity > 0 ? "Savatga qo'shish" : "Mavjud emas"}</span>
          </button>
          <Link
            href={`/mahsulot/${product.slug}`}
            className="p-2.5 bg-white/90 dark:bg-graphite-800/90 text-graphite-900 dark:text-ivory-100 rounded-xl hover:text-gold-500 backdrop-blur-sm transition-colors"
            aria-label="Batafsil ko'rish"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Information Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Movement */}
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="uppercase tracking-[0.2em] font-semibold text-gold-600 dark:text-gold-400">
              {product.brand?.name || 'Swiss Watch'}
            </span>
            <span className="text-graphite-400 text-[10px] font-mono">
              {product.case_diameter_mm}mm • {product.movement_type}
            </span>
          </div>

          {/* Watch Title */}
          <Link href={`/mahsulot/${product.slug}`} className="block group-hover:text-gold-500 transition-colors">
            <h3 className="font-serif text-sm sm:text-base font-semibold text-graphite-900 dark:text-ivory-100 line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing & Mobile Action */}
        <div className="pt-3 mt-3 border-t border-graphite-100 dark:border-graphite-800/80 flex items-center justify-between">
          <div>
            <div
              suppressHydrationWarning
              className="text-sm sm:text-base font-bold text-graphite-900 dark:text-ivory-100 font-mono tracking-tight"
            >
              {formatUzs(currentPrice)}
            </div>
            {hasSale && (
              <div
                suppressHydrationWarning
                className="text-[11px] text-graphite-400 line-through font-mono"
              >
                {formatUzs(product.base_price_uzs)}
              </div>
            )}
          </div>

          {/* Mobile Only Quick Add Button */}
          <button
            onClick={() => addItem(product)}
            disabled={product.stock_quantity <= 0}
            className="sm:hidden p-2 rounded-lg bg-gold-500 text-white disabled:opacity-50"
            aria-label="Savatga qo'shish"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
