import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { DataStore } from '@/lib/data/store';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await DataStore.getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Soat topilmadi — CHRONOVA',
    };
  }

  const primaryImg = product.images?.[0]?.image_url || '/images/watches/rolex-submariner.jpg';

  return {
    title: `${product.name} — CHRONOVA Shveytsariya Butigi`,
    description: `${product.name} (Model: ${product.model_number}). Mexanizm: ${product.movement_type}, ${product.case_diameter_mm}mm, ${product.crystal_type} oyna. 100% asl nusxa va rasmiy kafolat.`,
    openGraph: {
      title: `${product.name} | CHRONOVA`,
      description: product.description,
      images: [{ url: primaryImg }],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await DataStore.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await DataStore.getProducts();
  const related = allProducts.filter(
    (p) => p.id !== product.id && (p.brand_id === product.brand_id || p.category_id === product.category_id)
  );

  const reviews = await DataStore.getReviewsForProduct(product.id);

  // JSON-LD structured data for Google SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map((img) => img.image_url) || [],
    description: product.description,
    sku: product.sku,
    mpn: product.model_number,
    brand: {
      '@type': 'Brand',
      name: product.brand?.name || 'Swiss Watch',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'UZS',
      price: product.sale_price_uzs || product.base_price_uzs,
      availability: product.stock_quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'CHRONOVA',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={related}
        reviews={reviews}
      />
    </>
  );
}
