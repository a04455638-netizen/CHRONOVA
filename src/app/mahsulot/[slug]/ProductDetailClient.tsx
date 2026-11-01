'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  CheckCircle2,
  Heart,
  ShoppingBag,
  Zap,
  ChevronRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Product, Review } from '@/types';
import { formatUzs } from '@/lib/utils/format';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useI18n } from '@/context/I18nContext';
import ProductCard from '@/components/store/ProductCard';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  reviews: Review[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  reviews: initialReviews,
}: ProductDetailClientProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { t } = useI18n();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [activeTab, setActiveTab] = useState<'specs' | 'delivery' | 'reviews'>('specs');

  // New review form state
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [
    {
      id: 'default',
      product_id: product.id,
      image_url: '/images/watches/rolex-submariner.jpg',
      alt_text: product.name,
      display_order: 1,
      is_primary: true,
    }
  ];

  const currentImage = images[activeImageIndex]?.image_url || images[0].image_url;
  const [mainImgSrc, setMainImgSrc] = useState(currentImage);

  useEffect(() => {
    setMainImgSrc(currentImage);
  }, [currentImage]);

  const inWishlist = isInWishlist(product.id);
  const hasSale = product.sale_price_uzs && product.sale_price_uzs < product.base_price_uzs;
  const currentPrice = hasSale ? product.sale_price_uzs! : product.base_price_uzs;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      product_id: product.id,
      customer_name: reviewerName.trim(),
      rating,
      comment: reviewComment.trim(),
      status: 'approved',
      created_at: new Date().toISOString(),
    };

    setReviews([newRev, ...reviews]);
    setReviewSubmitted(true);
    setReviewerName('');
    setReviewComment('');
  };

  const handleQuickBuy = () => {
    addItem(product, null, quantity);
    window.location.href = '/checkout';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-graphite-500 dark:text-ivory-400 mb-8 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-gold-500 transition-colors">Bosh sahifa</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/katalog" className="hover:text-gold-500 transition-colors">Katalog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {product.brand && (
          <>
            <Link href={`/katalog?brand=${product.brand.slug}`} className="hover:text-gold-500 transition-colors">
              {product.brand.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
          </>
        )}
        <span className="text-graphite-900 dark:text-ivory-100 font-medium truncate">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Image Gallery with Zoom */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Visual Frame */}
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-ivory-100 dark:bg-graphite-950 border border-gold-500/20 shadow-2xl flex items-center justify-center group">
            <Image
              src={mainImgSrc}
              alt={product.name}
              fill
              priority
              onError={() => setMainImgSrc('/images/watches/rolex-submariner.jpg')}
              className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out cursor-zoom-in"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-3 py-1 rounded-full bg-gold-500 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                100% Asl Shveytsariya
              </span>
              {hasSale && (
                <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                  Aksiya
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all ${
                inWishlist
                  ? 'bg-gold-500 text-white'
                  : 'bg-white/80 dark:bg-black/60 text-graphite-800 dark:text-ivory-200 hover:text-gold-500 hover:scale-110'
              }`}
              aria-label="Sevimlilarga qo'shish"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImageIndex === idx ? 'border-gold-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img.image_url} alt={img.alt_text} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Purchasing & Specs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Brand & Reference */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <Link
                href={`/katalog?brand=${product.brand?.slug}`}
                className="uppercase tracking-[0.25em] font-bold text-gold-600 dark:text-gold-400 hover:underline"
              >
                {product.brand?.name || 'Swiss Horology'}
              </Link>
              <span className="text-graphite-400 font-mono text-[11px]">
                Ref: {product.model_number}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-graphite-900 dark:text-ivory-100 leading-snug">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-gold-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-graphite-500 dark:text-ivory-400">
                (5.0 • {reviews.length} ta sharh)
              </span>
              <span className="text-graphite-400">•</span>
              <span className="text-xs text-gold-600 dark:text-gold-400 font-medium">
                SKU: {product.sku}
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-ivory-100 dark:bg-surface-dark border border-gold-500/20">
            <span className="text-[11px] uppercase tracking-wider text-graphite-500 block mb-1">
              Rasmiy Chakana Narxi:
            </span>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-graphite-900 dark:text-ivory-100 tracking-tight">
                {formatUzs(currentPrice)}
              </span>
              {hasSale && (
                <span className="font-mono text-sm text-graphite-400 line-through">
                  {formatUzs(product.base_price_uzs)}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${product.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-medium text-graphite-700 dark:text-ivory-200">
                {product.stock_quantity > 0
                  ? `Butik omborida mavjud (${product.stock_quantity} dona)`
                  : 'Hozircha sotuvda tugagan'}
              </span>
            </div>
          </div>

          {/* Description snippet */}
          <p className="text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Actions: Add to Cart + Quick Buy */}
          {product.stock_quantity > 0 ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-graphite-300 dark:border-graphite-700 rounded-xl px-3 py-2 bg-white dark:bg-surface-darkCard">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-graphite-500 hover:text-gold-500 px-2 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="text-graphite-500 hover:text-gold-500 px-2 text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => addItem(product, null, quantity)}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-graphite-900 dark:bg-graphite-800 hover:bg-gold-500 dark:hover:bg-gold-500 text-white text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Savatga Qo‘shish</span>
                </button>
              </div>

              {/* Instant Checkout Button */}
              <button
                onClick={handleQuickBuy}
                className="w-full py-3.5 px-6 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 shadow-luxury hover:shadow-luxury-hover transition-all"
              >
                <Zap className="w-4 h-4" />
                <span>Bir Bosqichda Xarid Qilish</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs">
              Ushbu model hozirda sotuvda tugagan. Qayta keltirilishi haqida ma’lumot olish uchun konsyerj xizmatiga murojaat qiling.
            </div>
          )}

          {/* Guarantees List */}
          <div className="pt-6 border-t border-graphite-200 dark:border-graphite-800 space-y-3 text-xs text-graphite-600 dark:text-ivory-400">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-gold-500 flex-shrink-0" />
              <span>{product.warranty_years} Yillik xalqaro manufaktura kafolati</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-gold-500 flex-shrink-0" />
              <span>Toshkent bo‘ylab 24 soat ichida bepul sug‘urtalangan yetkazish</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-gold-500 flex-shrink-0" />
              <span>Qabul qilib olishda to‘liq ko‘rik va kuryerga xavfsiz to‘lov</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Technical Specifications, Delivery Guarantee, Client Reviews */}
      <div className="mt-16 sm:mt-24">
        <div className="flex border-b border-graphite-200 dark:border-graphite-800 gap-8">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-4 text-xs uppercase tracking-widest font-semibold transition-colors border-b-2 ${
              activeTab === 'specs'
                ? 'border-gold-500 text-gold-600 dark:text-gold-400'
                : 'border-transparent text-graphite-500 hover:text-gold-500'
            }`}
          >
            Texnik Xususiyatlar
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`pb-4 text-xs uppercase tracking-widest font-semibold transition-colors border-b-2 ${
              activeTab === 'delivery'
                ? 'border-gold-500 text-gold-600 dark:text-gold-400'
                : 'border-transparent text-graphite-500 hover:text-gold-500'
            }`}
          >
            Yetkazish va Kafolat
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-xs uppercase tracking-widest font-semibold transition-colors border-b-2 ${
              activeTab === 'reviews'
                ? 'border-gold-500 text-gold-600 dark:text-gold-400'
                : 'border-transparent text-graphite-500 hover:text-gold-500'
            }`}
          >
            Mijozlar Baholari ({reviews.length})
          </button>
        </div>

        {/* Tab 1: Technical Specs Table */}
        {activeTab === 'specs' && (
          <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-graphite-900 dark:text-ivory-100">
                Asosiy Ko‘rsatkichlar
              </h3>
              <dl className="divide-y divide-graphite-200 dark:divide-graphite-800 text-xs">
                <div className="py-2.5 flex justify-between">
                  <dt className="text-graphite-500">Brend</dt>
                  <dd className="font-semibold text-graphite-900 dark:text-ivory-100">{product.brand?.name}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-graphite-500">Model Raqami</dt>
                  <dd className="font-mono font-semibold text-graphite-900 dark:text-ivory-100">{product.model_number}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-graphite-500">Mexanizm turi</dt>
                  <dd className="font-semibold text-graphite-900 dark:text-ivory-100">{product.movement_type}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-graphite-500">Korpus diametri</dt>
                  <dd className="font-semibold text-graphite-900 dark:text-ivory-100">{product.case_diameter_mm} mm</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-graphite-500">Korpus materiali</dt>
                  <dd className="font-semibold text-graphite-900 dark:text-ivory-100">{product.case_material}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-graphite-500">Oyna turi</dt>
                  <dd className="font-semibold text-graphite-900 dark:text-ivory-100">{product.crystal_type} oynasi</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-graphite-500">Suvga chidamlilik</dt>
                  <dd className="font-semibold text-graphite-900 dark:text-ivory-100">{product.water_resistance_atm} ATM ({product.water_resistance_atm * 10} metr)</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-graphite-500">Tasma materiali</dt>
                  <dd className="font-semibold text-graphite-900 dark:text-ivory-100">{product.strap_material}</dd>
                </div>
              </dl>
            </div>

            {/* Custom Specs from DB if available */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-graphite-900 dark:text-ivory-100">
                Manufaktura Detallari
              </h3>
              {product.specs && product.specs.length > 0 ? (
                <dl className="divide-y divide-graphite-200 dark:divide-graphite-800 text-xs">
                  {product.specs.map((s, i) => (
                    <div key={i} className="py-2.5 flex justify-between">
                      <dt className="text-graphite-500">{s.spec_name}</dt>
                      <dd className="font-semibold text-graphite-900 dark:text-ivory-100">{s.spec_value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-xs text-graphite-500">
                  Ushbu model Shveytsariya manufaktura standartlariga to‘liq mos keladi.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Delivery & Warranty */}
        {activeTab === 'delivery' && (
          <div className="py-8 max-w-3xl space-y-6 text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 leading-relaxed">
            <h3 className="font-serif text-lg font-bold text-graphite-900 dark:text-ivory-100">
              CHRONOVA Xizmat Kafolatlari
            </h3>
            <p>
              1. <b>100% Asl mahsulot:</b> Har bir soat Shveytsariyaning rasmiy distribyutorlaridan to‘g‘ridan-to‘g‘ri keltiriladi va asl qutisi, xalqaro kafolat kartasi hamda yo‘riqnomasi bilan yetkaziladi.
            </p>
            <p>
              2. <b>Toshkent bo‘ylab kuryerlik:</b> Buyurtmangiz tasdiqlangandan so‘ng 24 soat ichida shaxsiy konsyerj kuryerimiz orqali belgilangan manzilga xavfsiz holatda olib boriladi.
            </p>
            <p>
              3. <b>Ko‘rib to‘lash:</b> Siz mahsulotni to‘liq ochib, korpus, siferblat va qutisini ko‘zdan kechirganingizdan keyin kuryerga naqd yoki bank kartasi orqali to‘lov qilasiz.
            </p>
          </div>
        )}

        {/* Tab 3: Reviews & Add Review Form */}
        {activeTab === 'reviews' && (
          <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-serif text-lg font-bold text-graphite-900 dark:text-ivory-100">
                Mijozlarimiz Fikrlari
              </h3>
              {reviews.length === 0 ? (
                <p className="text-xs text-graphite-500 py-4">Hozircha sharhlar yo‘q. Birinchi bo‘lib fikr qoldiring!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-ivory-100 dark:bg-surface-dark border border-graphite-200 dark:border-graphite-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-xs text-graphite-900 dark:text-ivory-100">{rev.customer_name}</span>
                      <div className="flex text-gold-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    {rev.title && <h4 className="text-xs font-bold text-graphite-800 dark:text-ivory-200 mb-1">{rev.title}</h4>}
                    <p className="text-xs text-graphite-600 dark:text-ivory-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Submit Review Form */}
            <div className="lg:col-span-5 bg-white dark:bg-surface-darkCard p-6 rounded-2xl border border-gold-500/20">
              <h3 className="font-serif text-base font-bold text-graphite-900 dark:text-ivory-100 mb-4">
                O‘z Fikringizni Qoldiring
              </h3>

              {reviewSubmitted ? (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-300 text-xs text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-1" />
                  <p className="font-bold">Sharhingiz qabul qilindi!</p>
                  <p className="text-[11px]">Butikimizni tanlaganingiz uchun tashakkur.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-graphite-600 dark:text-ivory-300 mb-1 font-medium">Ismingiz</label>
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="Masalan: Sardor"
                      className="w-full bg-ivory-100 dark:bg-surface-dark border border-graphite-300 dark:border-graphite-700 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-graphite-600 dark:text-ivory-300 mb-1 font-medium">Baho</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className={`p-1 rounded ${rating >= star ? 'text-gold-500' : 'text-gray-400'}`}
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-graphite-600 dark:text-ivory-300 mb-1 font-medium">Fikringiz</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Soat sifati, kuryer xizmati yoki his-tuyg‘ularingiz haqida..."
                      className="w-full bg-ivory-100 dark:bg-surface-dark border border-graphite-300 dark:border-graphite-700 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs uppercase tracking-wider transition-colors"
                  >
                    Yuborish
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Watches */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-graphite-200 dark:border-graphite-800">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-widest text-gold-600 dark:text-gold-400 font-semibold block mb-1">
              Tavsiya Etiladi
            </span>
            <h2 className="font-serif text-2xl font-bold text-graphite-900 dark:text-ivory-100">
              O‘xshash Durdonalar
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
